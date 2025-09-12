import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../../hooks/useAuth';
import SupabaseService from '../../services/SupabaseService';
import { SearchResult, MealType } from '../../types/meal-types';

interface AutocompleteSearchProps {
    selectedMealType: MealType;
    setSelectedMealType: (mealType: MealType) => void;
    onMealAdd: (searchResult: SearchResult) => void;
    submitMessage: { text: string; type: 'success' | 'error' | 'info' } | null;
}

const AutocompleteSearch: React.FC<AutocompleteSearchProps> = ({
    selectedMealType,
    setSelectedMealType,
    onMealAdd,
    submitMessage
}) => {
    const { user } = useAuth();
    const [autocompleteQuery, setAutocompleteQuery] = useState('');
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [totalSearchResults, setTotalSearchResults] = useState<number>(0);
    const [showAutocomplete, setShowAutocomplete] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [showingAllResults, setShowingAllResults] = useState(false);
    const autocompleteRef = useRef<HTMLDivElement>(null);

    const debouncedSearch = useCallback(
        async (query: string) => {
            if (!query.trim() || !user) {
                setSearchResults([]);
                setTotalSearchResults(0);
                setShowAutocomplete(false);
                setShowingAllResults(false);
                return;
            }

            setIsSearching(true);
            setShowingAllResults(false);
            try {
                const { data, totalCount, error } = await SupabaseService.searchFoodsAndCustomMeals(user.id, query.trim(), 5);
                
                if (error) {
                    console.error('Search error:', error);
                    setSearchResults([]);
                    setTotalSearchResults(0);
                } else {
                    setSearchResults(data);
                    setTotalSearchResults(totalCount || 0);
                    setShowAutocomplete(data.length > 0);
                }
            } catch (error) {
                console.error('Search failed:', error);
                setSearchResults([]);
                setTotalSearchResults(0);
            } finally {
                setIsSearching(false);
            }
        },
        [user]
    );

    useEffect(() => {
        const timer = setTimeout(() => {
            if (autocompleteQuery.length >= 2) {
                debouncedSearch(autocompleteQuery);
            } else {
                setSearchResults([]);
                setShowAutocomplete(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [autocompleteQuery, debouncedSearch]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (autocompleteRef.current && !autocompleteRef.current.contains(event.target as Node)) {
                setShowAutocomplete(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleShowAllResults = async () => {
        if (!user || !autocompleteQuery.trim()) return;

        setIsSearching(true);
        try {
            const { data, error } = await SupabaseService.searchAllFoodsAndCustomMeals(user.id, autocompleteQuery.trim());
            
            if (error) {
                console.error('Show all search error:', error);
            } else {
                setSearchResults(data);
                setShowingAllResults(true);
            }
        } catch (error) {
            console.error('Show all search failed:', error);
        } finally {
            setIsSearching(false);
        }
    };

    const handleMealAdd = (searchResult: SearchResult) => {
        onMealAdd(searchResult);
        setAutocompleteQuery('');
        setShowAutocomplete(false);
        setShowingAllResults(false);
        setTotalSearchResults(0);
    };

    return (
        <div className="add-meals__search-section">
            <div className="add-meals__search-container" ref={autocompleteRef}>
                <div className="add-meals__search-input-row">
                    <input
                        type="text"
                        placeholder="Search foods and meals..."
                        value={autocompleteQuery}
                        onChange={(e) => {
                            setAutocompleteQuery(e.target.value);
                            if (e.target.value.length >= 2) {
                                setShowAutocomplete(true);
                            }
                        }}
                        onFocus={() => {
                            if (autocompleteQuery.length >= 2 && searchResults.length > 0) {
                                setShowAutocomplete(true);
                            }
                        }}
                        className="add-meals__autocomplete-input"
                    />
                    <select
                        value={selectedMealType}
                        onChange={(e) => setSelectedMealType(e.target.value as MealType)}
                        className="add-meals__meal-type-select"
                    >
                        <option value="breakfast">🌅 Breakfast</option>
                        <option value="lunch">☀️ Lunch</option>
                        <option value="dinner">🌙 Dinner</option>
                        <option value="snack">🍿 Snack</option>
                    </select>
                </div>

                {autocompleteQuery.length >= 2 && !isSearching && (
                    <div className="add-meals__search-results-count">
                        {totalSearchResults === 0 
                            ? `No foods found for "${autocompleteQuery}"` 
                            : showingAllResults 
                                ? `Showing all ${totalSearchResults} food${totalSearchResults === 1 ? '' : 's'} for "${autocompleteQuery}"`
                                : `Found ${totalSearchResults} food${totalSearchResults === 1 ? '' : 's'} for "${autocompleteQuery}"`
                        }
                    </div>
                )}

                {showAutocomplete && (
                    <div className="add-meals__autocomplete-dropdown">
                        {isSearching ? (
                            <div className="add-meals__autocomplete-loading">
                                <span>Searching...</span>
                            </div>
                        ) : searchResults.length > 0 ? (
                            <>
                                {(showingAllResults ? searchResults : searchResults.slice(0, 5)).map((result) => (
                                    <div
                                        key={`${result.source}-${result.id}`}
                                        className="add-meals__autocomplete-item"
                                        onClick={() => handleMealAdd(result)}
                                    >
                                        <div className="add-meals__autocomplete-item-content">
                                            <div className="add-meals__autocomplete-item-header">
                                                <span className="add-meals__autocomplete-item-name">{result.name}</span>
                                                <span className="add-meals__autocomplete-item-source">
                                                    {result.source === 'custom_meals' ? '👤 Custom' : '🍎 Standard'}
                                                </span>
                                            </div>
                                            <div className="add-meals__autocomplete-item-nutrition">
                                                <span>{Math.round(result.calories_per_100g)} cal</span>
                                                <span>{result.protein_g}g protein</span>
                                                <span>{result.carbohydrates_g}g carbs</span>
                                                <span>{result.fats_g}g fat</span>
                                            </div>
                                        </div>
                                        <button className="add-meals__autocomplete-add-btn">
                                            +
                                        </button>
                                    </div>
                                ))}
                                {!showingAllResults && totalSearchResults > 5 && (
                                    <div className="add-meals__autocomplete-show-all" onClick={handleShowAllResults}>
                                        <span>Show all {totalSearchResults} results</span>
                                        <span className="add-meals__autocomplete-arrow">▼</span>
                                    </div>
                                )}
                            </>
                        ) : autocompleteQuery.length >= 2 ? (
                            <div className="add-meals__autocomplete-empty">
                                <span>No foods found for "{autocompleteQuery}"</span>
                            </div>
                        ) : null}
                    </div>
                )}
            </div>

            {submitMessage && (
                <div className={`add-meals__message add-meals__message--${submitMessage.type}`}>
                    {submitMessage.text}
                </div>
            )}
        </div>
    );
};

export default AutocompleteSearch;