import React, { useState, useEffect } from 'react';

// Removed COLORS array

// Returns a high-quality base neutral image based on the keyword/title of the product
const getBaseImage = (keyword, title) => {
  const k = `${keyword || ''} ${title || ''}`.toLowerCase();
  
  if (k.includes('curtain') || k.includes('drape') || k.includes('blind') || k.includes('shade') || k.includes('window treatment')) {
    return 'https://images.unsplash.com/photo-1514894780887-121968d00567?auto=format&fit=crop&w=600&q=80'; // Neutral curtains
  }
  if (k.includes('pillow') || k.includes('cushion') || k.includes('throw pillow') || k.includes('blanket') || k.includes('throw')) {
    return 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=600&q=80'; // Neutral pillows/blanket
  }
  if (k.includes('plant') || k.includes('planter') || k.includes('pot') || k.includes('flower') || k.includes('bonsai')) {
    return 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=600&q=80'; // Green plants in neutral pot
  }
  if (k.includes('sofa') || k.includes('couch') || k.includes('loveseat') || k.includes('sectional') || k.includes('futon')) {
    return 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80'; // Modern neutral sofa
  }
  if (k.includes('chair') || k.includes('armchair') || k.includes('recliner') || k.includes('stool') || k.includes('seating') || k.includes('bench')) {
    return 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=600&q=80'; // Modern accent chair
  }
  if (k.includes('dining table') || k.includes('coffee table') || k.includes('credenza') || k.includes('table') || k.includes('desk')) {
    if (k.includes('desk') || k.includes('workspace')) {
      return 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=600&q=80'; // Desk
    }
    return 'https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&w=600&q=80'; // Table
  }
  if (k.includes('bed') || k.includes('mattress') || k.includes('headboard') || k.includes('nightstand')) {
    return 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=600&q=80'; // Bed
  }
  if (k.includes('bookshelf') || k.includes('bookcase') || k.includes('shelving') || k.includes('rack')) {
    return 'https://images.unsplash.com/photo-1594620302200-9a7b2241a106?auto=format&fit=crop&w=600&q=80'; // Bookshelf
  }
  if (k.includes('lamp') || k.includes('light') || k.includes('lighting') || k.includes('chandelier') || k.includes('pendant')) {
    return 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80'; // Lamp
  }
  if (k.includes('rug') || k.includes('carpet')) {
    return 'https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=600&q=80'; // Rug
  }
  if (k.includes('wardrobe') || k.includes('closet') || k.includes('cabinet') || k.includes('dresser') || k.includes('drawer') || k.includes('mirror') || k.includes('art') || k.includes('decor')) {
    return 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=600&q=80'; // Dresser
  }
  if (k.includes('refrigerator') || k.includes('fridge') || k.includes('freezer')) {
    return 'https://images.unsplash.com/photo-1571175432247-5c86c4f487f3?auto=format&fit=crop&w=600&q=80'; // Refrigerator
  }
  if (k.includes('microwave') || k.includes('toaster') || k.includes('oven') || k.includes('stove') || k.includes('range') || k.includes('cooker') || k.includes('appliance')) {
    return 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=600&q=80'; // Oven/Microwave
  }
  if (k.includes('washing machine') || k.includes('washer') || k.includes('dryer') || k.includes('laundry')) {
    return 'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?auto=format&fit=crop&w=600&q=80'; // Laundry
  }
  if (k.includes('dishwasher')) {
    return 'https://images.unsplash.com/photo-1585515306902-1224f8c47120?auto=format&fit=crop&w=600&q=80'; // Dishwasher
  }
  if (k.includes('coffee') || k.includes('espresso') || k.includes('kettle')) {
    return 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=600&q=80'; // Coffee maker
  }
  if (k.includes('blender') || k.includes('mixer') || k.includes('processor') || k.includes('juicer')) {
    return 'https://images.unsplash.com/photo-1578643463396-0997cb5328c1?auto=format&fit=crop&w=600&q=80'; // Blender
  }
  if (k.includes('vacuum') || k.includes('cleaner') || k.includes('robot')) {
    return 'https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&w=600&q=80'; // Vacuum cleaner
  }
  if (k.includes('air conditioner') || k.includes('ac') || k.includes('heater') || k.includes('fan')) {
    return 'https://images.unsplash.com/photo-1621905252507-b354bc25edac?auto=format&fit=crop&w=600&q=80'; // AC
  }
  if (k.includes('tv') || k.includes('television') || k.includes('screen') || k.includes('monitor')) {
    return 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=600&q=80'; // TV
  }
  if (k.includes('purifier') || k.includes('humidifier')) {
    return 'https://images.unsplash.com/photo-1585672841961-460d3fc3c030?auto=format&fit=crop&w=600&q=80'; // Air purifier
  }
  return 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=600&q=80'; // Fallback room image
};

// Formats the badge style based on retailer
const getRetailerStyle = (retailer) => {
  const r = retailer.toLowerCase();
  if (r.includes('ikea')) return { bg: 'bg-[#0051ba]/10 text-[#0051ba] border border-[#0051ba]/20', label: 'IKEA' };
  if (r.includes('amazon')) return { bg: 'bg-[#ff9900]/10 text-[#a36200] border border-[#ff9900]/20', label: 'Amazon' };
  if (r.includes('wayfair')) return { bg: 'bg-[#7f187f]/10 text-[#7f187f] border border-[#7f187f]/20', label: 'Wayfair' };
  if (r.includes('west elm')) return { bg: 'bg-stone-900 text-stone-100', label: 'West Elm' };
  if (r.includes('target')) return { bg: 'bg-[#cc0000]/10 text-[#cc0000] border border-[#cc0000]/20', label: 'Target' };
  if (r.includes('crate')) return { bg: 'bg-[#111111] text-white', label: 'Crate & Barrel' };
  return { bg: 'bg-amber-900/10 text-amber-900 border border-amber-900/20', label: retailer };
};

function Shop() {
  const [searchQuery, setSearchQuery] = useState('refrigerator');
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Redirection handling states
  const [redirectingProduct, setRedirectingProduct] = useState(null);
  const [countdown, setCountdown] = useState(3);

  // Initial load
  useEffect(() => {
    fetchProducts();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Countdown timer for redirection modal
  useEffect(() => {
    if (redirectingProduct && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (redirectingProduct && countdown === 0) {
      window.open(redirectingProduct.redirectUrl, '_blank');
      // Reset redirection state
      setRedirectingProduct(null);
    }
  }, [redirectingProduct, countdown]);

  const fetchProducts = async (e) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const queryParam = searchQuery.trim() || 'appliance';
      const response = await fetch(`/api/shop/search?q=${encodeURIComponent(queryParam)}`);
      
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
      
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Unable to fetch items from the internet. Please ensure the backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRedirectStart = (product) => {
    setRedirectingProduct(product);
    setCountdown(2); // 2 seconds countdown
  };

  return (
    <div className="space-y-12 pb-16">
      {/* Header Banner Section */}
      <div className="bg-[#FAF8F5] border border-[#EAE6DF] rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden shadow-sm">
        <div className="absolute inset-0 bg-gradient-to-br from-[#caa74a]/5 via-transparent to-transparent pointer-events-none" />
        
        <div className="relative z-10 max-w-2xl mx-auto space-y-4">
          <span className="text-xs font-bold tracking-[0.2em] text-[#caa74a] uppercase">
            Curated Shopping Experience
          </span>
          <h1 className="text-4xl md:text-5xl font-['Playfair_Display'] font-medium text-[#2E2B27] leading-tight">
            Atelier Product Shop
          </h1>
          <p className="text-gray-600 max-w-lg mx-auto">
            Search for premium home appliances and furniture products available online with instant redirection to purchase apps.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <form onSubmit={fetchProducts} className="bg-white border border-[#EAE6DF] rounded-2xl p-4 sm:p-6 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        {/* Search Input field */}
        <div className="relative flex-1 w-full">
          <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products (e.g. refrigerator, microwave, washing machine, sofa...)"
            className="w-full pl-11 pr-4 py-3 bg-[#FAF8F5] border border-[#EAE6DF] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8C4324] focus:border-transparent text-[#2E2B27] placeholder-gray-400 text-sm font-medium transition-all"
          />
        </div>

        {/* Search button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full md:w-auto px-8 py-3 bg-[#8C4324] hover:bg-[#723218] text-white font-semibold rounded-xl transition-all duration-300 shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed text-sm"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4.5 w-4.5 border-2 border-white border-t-transparent" />
              <span>Fetching...</span>
            </>
          ) : (
            <>
              <span>SEARCH PRODUCTS</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </>
          )}
        </button>
      </form>

      {/* Main Content Space */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-2xl flex items-center gap-3">
          <svg className="w-5 h-5 flex-shrink-0 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      {/* Grid of Results */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white border border-[#EAE6DF] rounded-2xl p-4 space-y-4 animate-pulse">
              <div className="h-56 bg-gray-200 rounded-xl w-full" />
              <div className="h-4 bg-gray-200 rounded w-1/3" />
              <div className="h-6 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
              <div className="flex justify-between items-center pt-2">
                <div className="h-6 bg-gray-200 rounded w-1/4" />
                <div className="h-10 bg-gray-200 rounded-xl w-1/3" />
              </div>
            </div>
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => {
            const baseImg = product.imageUrl || getBaseImage(product.imageKeyword, product.title);
            const retailerConfig = getRetailerStyle(product.retailer);

            return (
              <div
                key={product.id}
                className="bg-white border border-[#EAE6DF] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col group"
              >
                {/* Image Section */}
                <div className="relative h-56 bg-stone-100 overflow-hidden">
                  <img
                    src={baseImg}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = getBaseImage(product.imageKeyword, product.title);
                    }}
                  />

                  {/* Brand / Retailer badge */}
                  <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${retailerConfig.bg}`}>
                    {retailerConfig.label}
                  </span>
                </div>

                {/* Info Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    {/* Stars and Reviews */}
                    <div className="flex items-center gap-1">
                      {(() => {
                        const ratingVal = Number(product.rating);
                        const displayRating = !isNaN(ratingVal) ? ratingVal.toFixed(1) : '4.5';
                        const starsCount = !isNaN(ratingVal) ? Math.floor(ratingVal) : 5;
                        return (
                          <>
                            <div className="flex text-amber-500">
                              {[...Array(5)].map((_, i) => (
                                <svg
                                  key={i}
                                  className={`w-3.5 h-3.5 ${i < starsCount ? 'fill-current' : 'text-gray-300'}`}
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                            <span className="text-[11px] font-semibold text-gray-500">
                              {displayRating} ({product.reviewsCount || '76'} reviews)
                            </span>
                          </>
                        );
                      })()}
                    </div>

                    {/* Title */}
                    <h3 className="font-['Playfair_Display'] text-lg font-bold text-[#2E2B27] leading-snug group-hover:text-[#8C4324] transition-colors duration-200">
                      {product.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-500 text-xs leading-relaxed line-clamp-2">
                      {product.description || 'Premium craftsmanship with solid wooden details, ideal for elegant room styles.'}
                    </p>
                  </div>

                  {/* Price and CTA */}
                  <div className="flex justify-between items-center pt-2 border-t border-[#FAF8F5]">
                    <div>
                      <span className="text-stone-400 text-[10px] font-bold block uppercase tracking-wider">Estimated Price</span>
                      <span className="text-xl font-bold text-[#8C4324]">{product.price || '$399'}</span>
                    </div>
                    
                    <button
                      onClick={() => handleRedirectStart(product)}
                      className="px-4.5 py-2.5 bg-[#FAF8F5] border border-[#EAE6DF] hover:bg-[#8C4324] hover:text-white hover:border-[#8C4324] text-[#2E2B27] text-xs font-bold rounded-xl transition-all duration-300 flex items-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <span>VIEW ON {retailerConfig.label.toUpperCase()}</span>
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-[#FAF8F5] border border-dashed border-[#EAE6DF] rounded-3xl space-y-4">
          <div className="w-16 h-16 mx-auto bg-stone-100 rounded-full flex items-center justify-center text-3xl">
            🛋️
          </div>
          <h3 className="font-['Playfair_Display'] text-xl font-bold text-[#2E2B27]">No products found</h3>
          <p className="text-gray-500 text-sm max-w-sm mx-auto">
            Try adjusting your search terms (e.g. "refrigerator", "microwave", "sofa", "lamp") and try again.
          </p>
        </div>
      )}

      {/* Premium Redirection Modal Overlay */}
      {redirectingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-3xl border border-[#EAE6DF] shadow-2xl p-8 max-w-sm w-full text-center space-y-6 relative overflow-hidden transform scale-95 transition-transform duration-300">
            {/* Top geometric accent */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#caa74a] to-[#8C4324]" />
            
            {/* Store Icon Circle */}
            <div className="w-20 h-20 mx-auto bg-[#FAF8F5] border border-[#EAE6DF] rounded-full flex items-center justify-center text-3xl shadow-inner relative animate-pulse">
              🛒
              <span className="absolute bottom-0 right-0 bg-[#8C4324] text-white text-[10px] w-6 h-6 rounded-full flex items-center justify-center font-bold">
                {countdown}
              </span>
            </div>

            <div className="space-y-2">
              <h3 className="font-['Playfair_Display'] text-xl font-bold text-[#2E2B27]">
                Opening App
              </h3>
              <p className="text-gray-500 text-sm">
                Redirecting you to <strong className="text-[#8C4324]">{redirectingProduct.retailer}</strong> to view <strong>{redirectingProduct.title}</strong>...
              </p>
            </div>

            {/* Spinner Progress */}
            <div className="flex justify-center items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#8C4324] animate-bounce delay-100" />
              <div className="w-2 h-2 rounded-full bg-[#caa74a] animate-bounce delay-200" />
              <div className="w-2 h-2 rounded-full bg-[#8C4324] animate-bounce delay-300" />
            </div>

            {/* Secondary Option */}
            <button
              onClick={() => {
                window.open(redirectingProduct.redirectUrl, '_blank');
                setRedirectingProduct(null);
              }}
              className="text-xs text-gray-400 hover:text-[#8C4324] hover:underline"
            >
              Click here if you are not redirected automatically
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Shop;
