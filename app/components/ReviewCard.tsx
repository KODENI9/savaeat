
import {ReviewWithUser } from "@/src/types";
import Image from "next/image";
import { Timestamp} from "firebase/firestore";
interface ReviewCardProps {
  review: ReviewWithUser;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review}) => {
  return (
    <div
      key={review.id}
      className="card bg-gray-50 shadow-md hover:shadow-xl transition-shadow duration-300 rounded-2xl p-5 border border-gray-200"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-4">
          <div className="avatar">
            <div className="bg-gray-300 text-gray-700 rounded-full w-12 h-12 flex items-center justify-center text-lg font-bold">
              {review.user?.profileImageUrl ? (
                <Image
                  src={review.user.profileImageUrl}
                  alt="Profile"
                  width={48}
                  height={48}
                  className="rounded-full"
                />
              ) : (
                <span>{review.user?.name?.[0]?.toUpperCase() || "C"}</span>
              )}
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-gray-800 text-base">
              {review.user?.name}
            </span>
            <span className="text-xs text-gray-400">
              {review.createdAt instanceof Timestamp
                ? new Date(review.createdAt.seconds * 1000).toLocaleDateString()
                : new Date(review.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1 text-yellow-400 font-semibold text-sm">
          <span>⭐</span>
          <span>{review.rating}/5</span>
        </div>
      </div>
      <div className="text-gray-700 text-sm leading-relaxed">{review.comment}</div>
    </div>
  );
};

export default ReviewCard;
