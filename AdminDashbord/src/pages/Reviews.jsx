import React, { useState, useEffect } from 'react';
import { 
  Star, 
  MessageSquare, 
  User, 
  Calendar, 
  Search,
  Filter,
  Package,
  ArrowRight
} from 'lucide-react';
import Card, { CardContent } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { getFeedbacks } from '../services/feedbackService';

const starRange = [1, 2, 3, 4, 5];

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterRating, setFilterRating] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const data = await getFeedbacks();
      setReviews(data);
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredReviews = reviews.filter(review => {
    const ratingMatch = filterRating === 'All' || review.rating === parseInt(filterRating);
    const searchMatch = searchQuery === '' || 
      review.userId?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.message?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return ratingMatch && searchMatch;
  });

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Customer Reviews</h1>
          <p className="text-slate-500 text-sm mt-1">Monitor customer satisfaction and feedback.</p>
        </div>
        <div className="flex items-center space-x-4 bg-white p-2 rounded-2xl shadow-sm border border-slate-100 px-4">
          <div className="flex items-center text-amber-500">
            <Star className="w-5 h-5 fill-current" />
            <span className="ml-2 text-xl font-bold text-slate-800">{averageRating}</span>
          </div>
          <div className="h-8 w-px bg-slate-100"></div>
          <div className="text-sm font-medium text-slate-500">
            {reviews.length} total reviews
          </div>
        </div>
      </div>

      <Card>
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-2 overflow-x-auto">
            <span className="text-sm text-slate-500 mr-2 flex items-center">
              <Filter className="w-4 h-4 mr-1" /> Rating:
            </span>
            {['All', '5', '4', '3', '2', '1'].map((rating) => (
              <button
                key={rating}
                onClick={() => setFilterRating(rating)}
                className={`px-4 py-2 text-sm font-medium rounded-xl transition-all whitespace-nowrap ${
                  filterRating === rating 
                    ? 'bg-red-50 text-red-600' 
                    : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                {rating === 'All' ? 'All' : `${rating} Stars`}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search feedback..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-400"
            />
          </div>
        </div>

        <CardContent className="p-6">
          {loading ? (
            <div className="py-20 text-center text-slate-400">Loading reviews...</div>
          ) : filteredReviews.length === 0 ? (
            <div className="py-20 text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="text-slate-300" size={32} />
              </div>
              <h3 className="text-slate-800 font-bold text-lg">No reviews found</h3>
              <p className="text-slate-500">Try adjusting your filters or search query.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredReviews.map((review) => (
                <div key={review._id} className="bg-slate-50 rounded-2xl p-5 border border-slate-100 hover:border-red-100 transition-all flex flex-col h-full">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-red-600 border border-slate-100 mr-3">
                        <User size={18} />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 text-sm">{review.userId?.name || 'Guest Customer'}</h4>
                        <div className="flex items-center mt-0.5">
                          {starRange.map((star) => (
                            <Star 
                              key={star} 
                              size={12} 
                              className={`${star <= review.rating ? 'text-amber-400 fill-current' : 'text-slate-300'}`} 
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-[10px]">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </Badge>
                  </div>

                  <p className="text-slate-600 text-sm leading-relaxed mb-4 italic flex-grow">
                    "{review.message || 'No message provided'}"
                  </p>

                  {review.tags && review.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {review.tags.map(tag => (
                        <span key={tag} className="text-[10px] bg-white text-slate-500 px-2 py-1 rounded-lg border border-slate-100 font-medium">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-auto pt-4 border-t border-slate-200/50 flex items-center justify-between text-[11px] text-slate-500">
                    <div className="flex items-center">
                      <Package size={14} className="mr-1.5" />
                      <span>{review.orderId?.orderType} {review.orderId?.tableNumber ? `• Table ${review.orderId.tableNumber}` : ''}</span>
                    </div>
                    <div className="flex items-center text-red-600 font-medium cursor-pointer hover:underline">
                      Order Details <ArrowRight size={12} className="ml-1" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
