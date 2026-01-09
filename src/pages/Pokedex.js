import React, { useEffect, useState, useRef, useCallback } from 'react'
import { useLocation } from 'react-router-dom'
import Header from '../components/Header'
import MobileHeader from '../components/MobileHeader'
import SearchBar from '../components/SearchBar'
import Grid from '../components/Grid'
import Footer from '../components/Footer'
import SkeletonGridItem from '../components/SkeletonGridItem'
import {
  fetchSetData,
  fetchPokemonCardsByName,
  fetchAllPokemonNames,
  fetchRandomPokemonCardsForPokedex,
  getCardsBySetId,
} from '../js/api'
import leven from 'leven'
import '../styles/Grid.css'

const ITEMS_PER_PAGE = 20

const PokedexPage = () => {
  const [sets, setSets] = useState([])
  const [series, setSeries] = useState([])
  const [selectedSeries, setSelectedSeries] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [displayedSets, setDisplayedSets] = useState([])
  const [viewMode, setViewMode] = useState('sets')
  const [selectedSet, setSelectedSet] = useState(null)
  const [cards, setCards] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingSets, setIsLoadingSets] = useState(true)
  const [releaseDateSortOrder, setReleaseDateSortOrder] = useState('asc')
  const [searchBy, setSearchBy] = useState('set')
  const [noResults, setNoResults] = useState(false)
  const [suggestedPokemon, setSuggestedPokemon] = useState([])
  const [pokemonNames, setPokemonNames] = useState([])

  // Lazy Loading State
  const [visibleItems, setVisibleItems] = useState([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const observer = useRef()

  const location = useLocation()

  // Reset lazy loading when source data changes
  useEffect(() => {
    setPage(1)
    setHasMore(true)

    let sourceData = []
    if (viewMode === 'sets') {
      sourceData = displayedSets
    } else {
      sourceData = cards
    }

    if (sourceData.length > 0) {
      setVisibleItems(sourceData.slice(0, ITEMS_PER_PAGE))
    } else {
      setVisibleItems([])
    }
  }, [displayedSets, cards, viewMode])

  // Pagination effect
  useEffect(() => {
    if (page === 1) return // Initial load handled by above effect

    let sourceData = []
    if (viewMode === 'sets') {
      sourceData = displayedSets
    } else {
      sourceData = cards
    }

    const nextItems = sourceData.slice(0, page * ITEMS_PER_PAGE)
    setVisibleItems(nextItems)

    if (nextItems.length >= sourceData.length) {
      setHasMore(false)
    }
  }, [page, displayedSets, cards, viewMode])

  const lastItemElementRef = useCallback(
    (node) => {
      if (isLoading || isLoadingSets) return
      if (observer.current) observer.current.disconnect()

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1)
        }
      })

      if (node) observer.current.observe(node)
    },
    [isLoading, isLoadingSets, hasMore]
  )

  useEffect(() => {
    fetchSetData()
      .then((data) => {
        const filteredData = data.filter(
          (set) => !['mcd14', 'mcd15', 'mcd17', 'mcd18'].includes(set.id)
        )
        const sortedData = filteredData.sort(
          (a, b) => new Date(b.releaseDate) - new Date(a.releaseDate)
        )

        setSets(sortedData)
        setSeries([...new Set(sortedData.map((set) => set.series))])
        setIsLoadingSets(false)
      })
      .catch((error) => {
        console.error(error)
        setIsLoadingSets(false)
      })

    const fetchNames = async () => {
      try {
        const names = await fetchAllPokemonNames()
        setPokemonNames(names)
      } catch (error) {
        console.error('Error fetching all Pokémon names:', error)
      }
    }

    fetchNames()
  }, [])

  useEffect(() => {
    // Extract the setId from the URL
    const params = new URLSearchParams(location.search)
    const setId = params.get('setId')

    if (setId && sets.length > 0) {
      // Ensure 'sets' has been populated
      const selected = sets.find((set) => set.id === setId)

      if (selected) {
        setSelectedSet(selected)
        handleSetClick(selected)
      }
    }
  }, [location.search, sets.length])

  useEffect(() => {
    if (searchBy === 'set') {
      let filteredSets = sets
      if (selectedSeries !== 'all') {
        filteredSets = filteredSets.filter(
          (set) => set.series === selectedSeries
        )
      }
      setDisplayedSets(filteredSets)
    }
  }, [sets, selectedSeries, searchBy])

  useEffect(() => {
    if (searchBy === 'set') {
      const filteredSets = sets.filter((set) =>
        set.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setDisplayedSets(filteredSets)
    }
  }, [searchTerm, sets, searchBy])

  useEffect(() => {
    if (viewMode === 'sets') {
      setCards([])
    }
  }, [viewMode])

  const sortSets = (order) => {
    const sortedSets = [...sets]
    sortedSets.sort((a, b) => {
      const dateA = new Date(a.releaseDate)
      const dateB = new Date(b.releaseDate)
      return order === 'asc' ? dateA - dateB : dateB - dateA
    })
    setSets(sortedSets)
  }

  const handleReleaseDateSortChange = (e) => {
    const order = e.target.value
    setReleaseDateSortOrder(order)
    sortSets(order)
    setViewMode('sets')
    setCards([])
  }

  const handleSeriesChange = (e) => {
    setSelectedSeries(e.target.value)
    setViewMode('sets')
    setCards([])
  }

  const specialCases = {
    farfetchd: "farfetch'd",
    sirfetchd: "sirfetch'd",
    'ho oh': 'ho-oh',
    'mr mime': 'mr. mime',
    'mime jr': 'mime jr.',
    porygon2: 'porygon2',
    porygonz: 'porygon-z',
    'type null': 'type: null',
    'nidoran f': 'nidoran♀',
    'nidoran m': 'nidoran♂',
    'wo chien': 'wo-chien',
    'chi yu': 'chi-yu',
    'chien pao': 'chien-pao',
    'ting lu': 'ting-lu',
  }

  const normalizeName = (name) => {
    const lowerCaseName = name.toLowerCase().replace(/\s+/g, '')
    return specialCases[lowerCaseName] || name
  }

  const findBestMatches = (term, limit = 1) => {
    if (!pokemonNames.length) {
      console.error('Pokémon names list is empty.')
      return []
    }

    const matches = pokemonNames.map((name) => ({
      name,
      distance: leven(term.toLowerCase(), name.toLowerCase()),
    }))

    matches.sort((a, b) => a.distance - b.distance)

    return matches.slice(0, limit).map((match) => match.name)
  }

  const handleSearch = async (term = searchTerm) => {
    if (searchBy === 'pokemon') {
      setIsLoading(true)
      try {
        const normalizedTerm = normalizeName(term)
        const specialSearchTerm = specialCases[normalizedTerm] || term
        let cardData = await fetchPokemonCardsByName(specialSearchTerm)
        cardData = cardData.filter(
          (card) => !['mcd14', 'mcd15', 'mcd17', 'mcd18'].includes(card.set.id)
        )
        setCards(cardData)
        setViewMode('cards')
        setIsLoading(false)
        setNoResults(cardData.length === 0)
        if (cardData.length === 0) {
          const bestMatches = findBestMatches(term)
          setSuggestedPokemon(bestMatches)
        }
      } catch (error) {
        console.error('Error fetching Pokémon cards:', error)
        setIsLoading(false)
        setNoResults(true)
        const bestMatches = findBestMatches(term)
        setSuggestedPokemon(bestMatches)
      }
    }
  }

  const handleSetClick = async (set) => {
    setIsLoading(true)

    try {
      const cardData = await getCardsBySetId(set.id)

      if (!cardData || cardData.length === 0) {
        console.error(`Set ID ${set.id} not found.`)
        setIsLoading(false)
        return
      }

      setSelectedSet(set)
      setViewMode('cards')
      setCards(cardData) // Load all data at once, let lazy loading handle rendering
      setIsLoading(false)
    } catch (error) {
      console.error('Error loading set cards:', error)
      setIsLoading(false)
    }
  }

  const handleBackToSets = () => {
    setViewMode('sets')
    setSelectedSet(null)
    setCards([])
  }

  const handleToggleSearchBy = async (value) => {
    setSearchBy(value)
    setSearchTerm('')
    setNoResults(false)
    setSuggestedPokemon([])
    setCards([])
    if (value === 'pokemon') {
      setIsLoading(true)
      const randomPokemonCards = await fetchRandomPokemonCardsForPokedex(5)
      setCards(randomPokemonCards)
      setIsLoading(false)
    } else {
      setCards([])
    }
    setViewMode(value === 'pokemon' ? 'cards' : 'sets')
  }

  const handleSuggestedPokemonClick = (name) => {
    const normalizedName = normalizeName(name)
    setSearchTerm(normalizedName)
    handleSearch(normalizedName)
  }

  // Grouping sets logic needs to handle visibleItems if we are grouping
  // However, grouping complicates the flat list lazy loader.
  // If viewMode === 'sets', we are grouping by series.
  // Lazy loading grouped content is tricky.
  // Strategy: Group ALL sets first, then slice the GROUPS?
  // Or slice the sets and then group?
  // Original code grouped *displayedSets*.
  // If we want infinite scroll on grouped sets, we should render groups as we scroll.
  // BUT, reusing the flat `visibleItems` approach for sets might break the `groupSetsBySeries` logic if `visibleItems` is just a flat list of sets.

  // Let's adapt:
  // If viewMode === 'sets', we can rely on `visibleItems` being a subset of `displayedSets`.
  // THEN we group `visibleItems`.
  // This means groups will appear/grow as we scroll down. This is acceptable.

  const groupSetsBySeries = (setsToGroup) => {
    return setsToGroup.reduce((acc, set) => {
      if (!acc[set.series]) {
        acc[set.series] = []
      }
      acc[set.series].push(set)
      return acc
    }, {})
  }

  const seriesSets = viewMode === 'sets' ? groupSetsBySeries(visibleItems) : {}

  return (
    <div className="container">
      <Header />
      <MobileHeader />

      <div className={`content`} style={{ background: '#080B12' }}>
        <SearchBar
          sortSets={sortSets}
          series={series}
          setSelectedSeries={handleSeriesChange}
          setSearchTerm={setSearchTerm}
          handleBackToSets={handleBackToSets}
          viewMode={viewMode}
          handleReleaseDateSortChange={handleReleaseDateSortChange}
          searchBy={searchBy}
          handleToggleSearchBy={handleToggleSearchBy}
          handleSearch={() => handleSearch(searchTerm)}
          isAuthenticated={false}
        />
        {viewMode === 'sets' ? (
          <>
            {Object.keys(seriesSets).map((seriesName) => (
              <div key={seriesName}>
                <h2 className={`series-title-main`}>{seriesName}</h2>
                {visibleItems.length > 0 && (
                  <Grid
                    sets={seriesSets[seriesName]}
                    viewMode={viewMode}
                    onSetClick={handleSetClick}
                    isAuthenticated={false}
                    binderCards={[]}
                  />
                )}
              </div>
            ))}
            {/* Observer Target */}
            <div ref={lastItemElementRef} style={{ margin: '0' }}>
              {(hasMore || isLoadingSets) && (
                <div
                  className="sets-grid"
                  style={{ marginTop: visibleItems.length > 0 ? '0' : '3rem' }}
                >
                  {Array.from({ length: 10 }).map((_, index) => (
                    <SkeletonGridItem key={index} />
                  ))}
                </div>
              )}
            </div>
          </>
        ) : noResults ? (
          <div className="no-results">
            No Pokémon found
            {suggestedPokemon.length > 0 && (
              <div>
                Did you mean
                {suggestedPokemon.map((name, index) => (
                  <span
                    key={index}
                    onClick={() => handleSuggestedPokemonClick(name)}
                    style={{
                      cursor: 'pointer',
                      color: '#BC4CCE',
                      marginLeft: '5px',
                      fontWeight: 500,
                    }}
                  >
                    {name}
                    {index < suggestedPokemon.length - 1 ? ',' : ''}
                  </span>
                ))}
                ?
              </div>
            )}
          </div>
        ) : (
          <>
            {visibleItems.length > 0 && (
              <Grid
                sets={displayedSets} // Unused in card mode
                viewMode={viewMode}
                cards={visibleItems} // Pass visible cards using the lazy loaded state
                onSetClick={handleSetClick}
                isAuthenticated={false}
                binderCards={[]}
                selectedSet={selectedSet}
              />
            )}
            {/* Observer Target for Cards */}
            <div ref={lastItemElementRef} style={{ margin: '0' }}>
              {(hasMore || isLoading) &&
                (viewMode === 'sets' ? (
                  <div className="sets-grid" style={{ marginTop: '0' }}>
                    {Array.from({ length: 10 }).map((_, index) => (
                      <SkeletonGridItem key={index} />
                    ))}
                  </div>
                ) : (
                  <div
                    className="cards-grid"
                    style={{
                      marginTop: visibleItems.length > 0 ? '0' : '3rem',
                    }}
                  >
                    {Array.from({ length: 20 }).map((_, index) => (
                      <div
                        key={index}
                        className="grid-item--card"
                        style={{
                          backgroundSize: 'contain',
                          backgroundPosition: 'center',
                          background: 'var(--black)',
                        }}
                      >
                        <div
                          className="card-wrapper"
                          style={{
                            width: '250px',
                            height: '350px',
                            borderRadius: '12px',
                            position: 'relative',
                          }}
                        >
                          <div
                            className="skeleton-loader"
                            style={{ borderRadius: '12px' }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  )
}

export default PokedexPage
