import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import Footer from '../common/Footer';
import ImhotepChefLogo from '../../assets/ImhotepChef.png';

const Dashboard = () => {
    const { user } = useAuth();
    const [ingredients, setIngredients] = useState([]);
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showRecipes, setShowRecipes] = useState(false);

    const addIngredient = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const newIngredient = formData.get("ingredient");
        
        if (newIngredient && newIngredient.trim()) {
            const trimmedIngredient = newIngredient.trim();
            // Check if ingredient already exists (case-insensitive)
            const exists = ingredients.some(
                ingredient => ingredient.toLowerCase() === trimmedIngredient.toLowerCase()
            );
            
            if (!exists) {
                setIngredients(prevIngredients => [...prevIngredients, trimmedIngredient]);
                e.target.reset(); // Clear the form
            }
        }
    };

    const removeIngredient = (ingredientToRemove) => {
        setIngredients(prevIngredients => 
            prevIngredients.filter(ingredient => ingredient !== ingredientToRemove)
        );
        
        // Hide recipes if we have less than 3 ingredients
        if (ingredients.length <= 3) {
            setShowRecipes(false);
            setRecipes([]);
        }
    };

    const getRecipe = async () => {
        if (ingredients.length < 3) {
            setError('You need at least 3 ingredients to generate a recipe.');
            return;
        }

        setLoading(true);
        setError('');
        setShowRecipes(true);

        try {
            const response = await axios.post('/api/recipes/generate/', {
                ingredients: ingredients
            });

            if (response.data.success && response.data.recipes) {
                setRecipes(response.data.recipes);
                if (response.data.ai_error) {
                    console.warn('AI service had issues, using fallback:', response.data.ai_error);
                }
            } else {
                setError('Failed to generate recipes. Please try again.');
            }
        } catch (error) {
            console.error('Recipe generation failed:', error);
            setError(
                error.response?.data?.error || 
                'Failed to generate recipes. Please check your internet connection and try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-100 via-indigo-100 to-blue-100 bg-chef-pattern">
            {/* Floating decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-20 w-32 h-32 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
                <div className="absolute top-40 right-20 w-24 h-24 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{animationDelay: '2s'}}></div>
                <div className="absolute bottom-20 left-40 w-40 h-40 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{animationDelay: '4s'}}></div>
            </div>

            <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                {/* Welcome Section */}
                <div className="chef-card rounded-3xl p-6 sm:p-8 lg:p-12 shadow-2xl border border-white/30 backdrop-blur-2xl bg-white/90 text-center">
                    {/* Header with Chef Logo and Brand */}
                    <div className="flex flex-col items-center mb-8">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full mb-4 shadow-lg border-4 border-white">
                            <img 
                                src={ImhotepChefLogo} 
                                alt="ImhotepChef Logo" 
                                className="w-14 h-14 object-contain"
                            />
                        </div>
                        <div
                            className="font-extrabold text-3xl sm:text-4xl mb-2 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 bg-clip-text text-transparent font-chef drop-shadow-lg tracking-wide"
                            style={{
                                letterSpacing: '0.04em',
                                lineHeight: '1.1',
                                textShadow: '0 2px 8px rgba(124,58,237,0.12)'
                            }}
                        >
                            Pharaohfolio
                        </div>
                        <p className="text-gray-500 text-sm mb-2">Simple Hosting for Single-Page Portfolios</p>
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-chef text-gray-800 mb-4">
                            Welcome to Your Dashboard
                        </h1>
                        <p className="text-lg sm:text-xl text-gray-600 font-medium leading-relaxed max-w-2xl">
                            Hello, <span className="font-bold text-primary-600">{user?.first_name || user?.username}</span>! Ready to cook something amazing with AI assistance?
                        </p>
                    </div>
                    
                    {/* Quick Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-lg mx-auto">
                        <a 
                            href="/recipe-history" 
                            className="chef-button bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white flex items-center space-x-2 w-full sm:w-auto"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        <span>View Recipe History</span>
                        </a>
                        <a 
                            href="/profile" 
                            className="chef-button bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white flex items-center space-x-2 w-full sm:w-auto"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <span>Profile Settings</span>
                        </a>
                    </div>
                </div>

                {/* Add Ingredient Section */}
                <div className="chef-card rounded-2xl p-6 sm:p-8 shadow-lg border border-white/30 backdrop-blur-2xl bg-white/90">
                    <div className="flex items-center space-x-4 mb-6">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl shadow-md flex items-center justify-center">
                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-2xl sm:text-3xl font-bold font-chef text-gray-800">
                                Add Ingredients
                            </h2>
                            <p className="text-gray-600 font-medium mt-1">
                                Start building your recipe by adding ingredients you have on hand
                            </p>
                        </div>
                    </div>
                    
                    <form onSubmit={addIngredient} className="max-w-2xl mx-auto">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Ingredient Name
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="e.g. oregano, tomatoes, chicken..."
                                        aria-label="Add ingredient"
                                        name="ingredient"
                                        className="chef-input pl-12 w-full"
                                        required
                                    />
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-end">
                                <button 
                                    type="submit" 
                                    className="chef-button bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white flex items-center space-x-2 w-full sm:w-auto"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    <span>Add Ingredient</span>
                                </button>
                            </div>
                        </div>
                    </form>

                    {/* Quick Add Suggestions */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600 mb-3 font-medium">
                            Popular ingredients to get you started:
                        </p>
                        <div className="flex flex-wrap gap-2 justify-center">
                            {['Chicken', 'Tomatoes', 'Onions', 'Garlic', 'Rice', 'Pasta', 'Cheese', 'Herbs'].map((ingredient) => (
                                <button
                                    key={ingredient}
                                    onClick={() => {
                                        const exists = ingredients.some(
                                            ing => ing.toLowerCase() === ingredient.toLowerCase()
                                        );
                                        if (!exists) {
                                            setIngredients(prev => [...prev, ingredient]);
                                        }
                                    }}
                                    className="px-3 py-1 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-full text-sm font-medium transition-colors duration-200 border border-purple-200 hover:border-purple-300"
                                >
                                    + {ingredient}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Error Display */}
                {error && (
                    <div className="chef-card rounded-2xl p-6 sm:p-8 shadow-lg border border-red-200 bg-red-50/80 backdrop-blur-2xl bg-white/90">
                        <div className="flex items-center justify-center space-x-4">
                            <div className="w-12 h-12 bg-red-500 rounded-xl shadow-md flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="text-center">
                                <h3 className="text-lg font-bold font-chef text-gray-800 mb-2">
                                    Recipe Generation Error
                                </h3>
                                <p className="text-red-700 font-medium">
                                    {error}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Recipe Display Component */}
                {showRecipes && (
                    <ImhotepRecipe 
                        recipes={recipes} 
                        loading={loading} 
                        error={error}
                    />
                )}

                {/* Getting Started Guide - Show when no ingredients */}
                {ingredients.length === 0 && (
                    <div className="chef-card rounded-2xl p-6 sm:p-8 shadow-lg border border-white/30 backdrop-blur-2xl bg-white/90">
                        <div className="text-center max-w-3xl mx-auto">
                            <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                                <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                                </svg>
                            </div>
                            
                            <h3 className="text-2xl font-bold font-chef text-gray-800 mb-4">
                                Let's Start Cooking!
                            </h3>
                            <p className="text-gray-600 font-medium mb-8 leading-relaxed">
                                Add at least 3 ingredients from your kitchen to generate personalized AI-powered recipes. 
                                Our chef will create amazing dishes based on what you have on hand.
                            </p>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                                <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
                                    <div className="w-8 h-8 bg-purple-500 rounded-lg mx-auto mb-3 flex items-center justify-center">
                                        <span className="text-white font-bold text-lg">1</span>
                                    </div>
                                    <h4 className="font-semibold text-gray-800 mb-2">Add Ingredients</h4>
                                    <p className="text-sm text-gray-600">Start with what you have in your kitchen</p>
                                </div>
                                
                                <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-200">
                                    <div className="w-8 h-8 bg-indigo-500 rounded-lg mx-auto mb-3 flex items-center justify-center">
                                        <span className="text-white font-bold text-lg">2</span>
                                    </div>
                                    <h4 className="font-semibold text-gray-800 mb-2">Generate Recipe</h4>
                                    <p className="text-sm text-gray-600">Let AI create perfect recipes for you</p>
                                </div>
                                
                                <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                                    <div className="w-8 h-8 bg-blue-500 rounded-lg mx-auto mb-3 flex items-center justify-center">
                                        <span className="text-white font-bold text-lg">3</span>
                                    </div>
                                    <h4 className="font-semibold text-gray-800 mb-2">Start Cooking</h4>
                                    <p className="text-sm text-gray-600">Follow the step-by-step instructions</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default Dashboard;