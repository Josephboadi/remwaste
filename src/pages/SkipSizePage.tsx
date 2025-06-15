import { useQuery } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import Fuse from 'fuse.js';
import { ZoomIn } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Select, SelectItem } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Slider } from '@/components/ui/slider';
import { getSkipData } from '@/lib/skipsizeApis';
import { cn } from '@/lib/utils';

interface Skip {
  id: number;
  size: number;
  hire_period_days: number;
  transport_cost: number | null;
  per_tonne_cost: number | null;
  price_before_vat: number;
  vat: number;
  postcode: string;
  area: string;
  forbidden: boolean;
  allowed_on_road: boolean;
  allows_heavy_waste: boolean;
  created_at: string;
  updated_at: string;
}

export interface progressType {
  label: string;
  icon: string;
}

export default function SkipSizePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState(() => localStorage.getItem('selectedSize') || searchParams.get('size') || '');
  const [selectedPrize, setSelectedPrize] = useState(() => localStorage.getItem('selectedPrize') || '');
  const [selectedHirePeriod, setSelectedHirePeriod] = useState(() => localStorage.getItem('selectedHirePeriod') || '');
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [sortOrder, setSortOrder] = useState(searchParams.get('sort') || 'priceAsc');
  const [hireFilter, setHireFilter] = useState(searchParams.get('hire') || '');
  const [yardFilter, setYardFilter] = useState(searchParams.get('yard') || '');
  const [priceRange, setPriceRange] = useState(() => {
    const stored = localStorage.getItem('priceRange');
    const fromParams = searchParams.get('priceRange');
    if (fromParams) {
      try {
        return JSON.parse(fromParams);
      } catch {
        return [0, 500];
      }
    }
    return stored ? JSON.parse(stored) : [0, 500];
  });
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);
  const itemsPerPage = 4;

  const { data: skips = [], isLoading } = useQuery<Skip[]>({
    queryKey: ['skips'],
    queryFn: async () => {
      const res = await getSkipData();
      // const res = await fetch('https://app.wewantwaste.co.uk/api/skips/by-location?postcode=NR32&area=Lowestoft');
      if (!res.statusText) {
        throw new Error('Failed to fetch skips');
      }
      return res.data;
    }
  });

  const hirePeriods = useMemo(() => Array.from(new Set(skips.map((skip) => `${skip.hire_period_days} days`))), [skips]);
  const yardSizes = useMemo(() => Array.from(new Set(skips.map((skip) => skip.size.toString()))), [skips]);

  const formattedSkips = useMemo(
    () =>
      skips.map((skip) => ({
        ...skip,
        label: `${skip.size} Yard Skip`,
        price: skip.price_before_vat,
        period: `${skip.hire_period_days} days`,
        image: '/fallback-image.jpg'
      })),
    [skips]
  );

  const fuse = new Fuse(formattedSkips, { keys: ['label'], threshold: 0.4 });
  const fuzzyResults = searchTerm ? fuse.search(searchTerm).map((result) => result.item) : formattedSkips;

  const filteredSkips = useMemo(() => {
    let result = fuzzyResults;

    if (hireFilter) {
      result = result.filter((skip) => skip.period === hireFilter);
    }

    if (yardFilter) {
      result = result.filter((skip) => skip.size.toString() === yardFilter);
    }

    result = result.filter((skip) => skip.price >= priceRange[0] && skip.price <= priceRange[1]);

    if (sortOrder === 'priceAsc') {
      result = result.sort((a, b) => a.price - b.price);
    } else if (sortOrder === 'priceDesc') {
      result = result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [fuzzyResults, hireFilter, yardFilter, sortOrder, priceRange]);

  const totalPages = Math.ceil(filteredSkips.length / itemsPerPage);
  const paginatedSkips = filteredSkips.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  useEffect(() => {
    setSearchParams({
      size: selectedSize,
      search: searchTerm,
      sort: sortOrder,
      hire: hireFilter,
      yard: yardFilter,
      priceRange: JSON.stringify(priceRange),
      page: String(page)
    });
    localStorage.setItem('selectedSize', selectedSize);
    localStorage.setItem('priceRange', JSON.stringify(priceRange));
    localStorage.setItem('selectedPrize', selectedPrize);
    localStorage.setItem('selectedHirePeriod', selectedHirePeriod);
  }, [selectedSize, selectedPrize, selectedHirePeriod, searchTerm, sortOrder, hireFilter, yardFilter, priceRange, page, setSearchParams]);

  const progressSteps = [
    { label: 'Postcode', icon: '📍' },
    { label: 'Waste Type', icon: '🗑️' },
    { label: 'Select Skip', icon: '📦' },
    { label: 'Permit Check', icon: '✅' },
    { label: 'Choose Date', icon: '📅' },
    { label: 'Payment', icon: '💳' }
  ];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const storeSelected = (data: any) => {
    if (data.size.toString() === selectedSize && data.price.toString() === selectedPrize && data.period.toString() === selectedHirePeriod) {
      setSelectedSize('');
      setSelectedPrize('');
      setSelectedHirePeriod('');
      localStorage.removeItem('selectedSize');
      localStorage.removeItem('selectedPrize');
      localStorage.removeItem('selectedHirePeriod');
    } else {
      setSelectedSize(data.size.toString());
      setSelectedPrize(data.price.toString());
      setSelectedHirePeriod(data.period.toString());
      localStorage.setItem('selectedPrize', data.price.toString());
      localStorage.setItem('selectedHirePeriod', data.period.toString());
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-white dark:from-gray-900 dark:to-gray-950 text-gray-900 dark:text-white transition-colors duration-300 p-6 ">
      <Progress activeStep="Select Skip" progressSteps={progressSteps} />

      <div className="max-w-7xl mx-auto pt-44 md:pt-28 lg:pt-24 ">
        <div className="text-center mb-8">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white tracking-tight"
          >
            Choose Your <span className="text-blue-600">Skip Size</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-2 text-sm md:text-base text-gray-600 dark:text-gray-300 max-w-xl mx-auto"
          >
            Select the skip size that best suits your needs.
          </motion.p>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <div className=" top-0 left-0">
            <div className="grid grid-cols-1 gap-4 mb-8">
              <Input type="text" placeholder="Search skip size..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />

              <Select value={sortOrder} onValueChange={setSortOrder}>
                <SelectItem value="priceAsc">Price: Low to High</SelectItem>
                <SelectItem value="priceDesc">Price: High to Low</SelectItem>
              </Select>

              <Select value={hireFilter} onValueChange={setHireFilter}>
                <SelectItem value="">All Hire Periods</SelectItem>
                {hirePeriods.map((period) => (
                  <SelectItem key={period} value={period}>
                    {period}
                  </SelectItem>
                ))}
              </Select>

              <Select value={yardFilter} onValueChange={setYardFilter}>
                <SelectItem value="">All Yard Sizes</SelectItem>
                {yardSizes.map((yard) => (
                  <SelectItem key={yard} value={yard}>
                    {yard} Yard
                  </SelectItem>
                ))}
              </Select>
            </div>

            <div className="mb-6">
              <label className="block mb-2 font-semibold">
                Filter by Price: £{priceRange[0]} - £{priceRange[1]}
              </label>
              <Slider value={priceRange} onValueChange={setPriceRange} min={0} max={500} step={10} className="w-full" />
            </div>
          </div>

          <div className="flex  flex-col flex-1">
            <div
              className={cn(
                !isLoading && paginatedSkips.length == 0 ? 'p-6 md:mt-20' : 'grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6'
              )}
            >
              {isLoading ? (
                [...Array(3)].map((_, index) => <Skeleton key={index} className="h-82 rounded-xl bg-gray-300 dark:bg-gray-800" />)
              ) : paginatedSkips.length == 0 ? (
                <div className="flex justify-center items-center">
                  <img
                    src="/no-data.png"
                    alt={'image'}
                    className="w-[300px] h-[272px] object-contain"
                    // onError={(e) => (e.currentTarget.src = '/fallback-image.jpg')}
                  />
                </div>
              ) : (
                paginatedSkips.map((skip, index) => (
                  <motion.div
                    key={skip.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <>
                      <Card
                        className={cn(
                          'relative group rounded-xl overflow-hidden cursor-pointer transition-all shadow-lg border border-gray-200 dark:border-gray-700',
                          selectedSize === skip.size.toString() ? 'ring-2 ring-blue-500' : ''
                        )}
                        onClick={() => storeSelected(skip)}
                      >
                        {/* Full image background */}
                        <div className="relative h-74 w-full overflow-hidden group">
                          <img
                            src={skip.image}
                            alt={`${skip.label} image`}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            onError={(e) => (e.currentTarget.src = '/fallback-image.jpg')}
                          />
                          <button
                            onClick={() => setZoomedImage(skip.image)}
                            className="absolute top-3 right-3 bg-transparent cursor-zoom-in hover:bg-white/20 w-10 h-10 text-gray-800 p-2 rounded-2xl shadow-md z-10"
                            title="Zoom"
                          >
                            <ZoomIn className=" text-blue-800" />
                          </button>
                          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/80 text-white flex flex-col justify-end p-4">
                            <div className="flex flex-row justify-between items-end">
                              <div className="flex flex-col">
                                <h3 className="text-lg font-bold drop-shadow-md">{skip.label}</h3>
                                <p className="text-sm drop-shadow-md">{skip.period} hire</p>
                                <p className="text-xl font-bold text-blue-400 drop-shadow-md">£{skip.price}</p>
                              </div>
                              {!skip.allowed_on_road && (
                                <span className="text-xs mt-1 bg-white/20 px-2 py-1 rounded-full w-fit drop-shadow-md">
                                  {skip.allowed_on_road ? '✅ Allowed on Road' : '🚫 Not Allowed on Road'}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </Card>
                    </>
                  </motion.div>
                ))
              )}
            </div>

            <div className="flex justify-center mt-8 gap-2 flex-wrap mb-28 md:mb-16">
              {page > 1 && (
                <Button variant="outline" className="rounded-full" onClick={() => setPage(page - 1)}>
                  ← Prev
                </Button>
              )}

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => {
                  if (totalPages <= 5) {
                    return true;
                  }
                  if (page <= 3) {
                    return p <= 5;
                  }
                  if (page >= totalPages - 2) {
                    return p >= totalPages - 4;
                  }
                  return Math.abs(p - page) <= 2;
                })
                .map((p) => (
                  <Button key={p} variant={page === p ? 'default' : 'outline'} className="rounded-full px-4" onClick={() => setPage(p)}>
                    {p}
                  </Button>
                ))}

              {page < totalPages && (
                <Button variant="outline" className="rounded-full" onClick={() => setPage(page + 1)}>
                  Next →
                </Button>
              )}
            </div>
          </div>
        </div>

        {selectedSize && formattedSkips.length > 0 && (
          <div className="fixed bottom-0 left-0 w-full bg-white/20 backdrop-blur-lg dark:bg-gray-900/30 border-t border-white/30 dark:border-gray-700/40 px-6 py-4 z-50 ">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
              {!selectedSize ? (
                <p>No skip selected</p>
              ) : (
                <div className="text-sm dark:text-white font-medium text-center md:text-left flex flex-row items-end gap-2">
                  <p className="text-lg font-bold drop-shadow-md">{`${selectedSize} Yard Skip`}</p>
                  <p className="text-lg">|</p>
                  <p className="text-xl font-bold text-blue-400 drop-shadow-md">{`£${selectedPrize}`}</p>
                  <p className="text-lg">|</p>
                  <p className="text-sm drop-shadow-md">{` ${selectedHirePeriod} hire`}</p>
                </div>
              )}

              <div className="flex gap-4">
                <Button
                  variant="outline"
                  className="bg-gray-800 text-white border-gray-600 hover:bg-gray-700"
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={page === 1}
                >
                  Back
                </Button>
                <Button
                  className="bg-blue-600 text-white hover:bg-blue-700"
                  onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                  disabled={page === totalPages}
                >
                  Continue
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {zoomedImage && (
          <motion.div
            className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative max-w-4xl w-full"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <button
                onClick={() => setZoomedImage(null)}
                className="absolute top-4 right-4 text-white w-10 h-10 shadow-md  hover:bg-white/30 p-2 rounded-2xl cursor-zoom-out"
                aria-label="Close"
              >
                ✖
              </button>
              <img src={zoomedImage} alt="Zoomed view" className="w-full h-auto max-h-[80vh] object-contain rounded-lg shadow-2xl" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
