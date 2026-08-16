import React from 'react';
import { IRiceCharacteristics } from '../types';
import { Sparkles, MapPin, Calendar, Layers } from 'lucide-react';

interface RiceMatrixProps {
  characteristics: IRiceCharacteristics;
}

export const RiceMatrix: React.FC<RiceMatrixProps> = ({ characteristics }) => {
  const renderStars = (score: number) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <div
            key={star}
            className={`w-3.5 h-3.5 rounded-full ${
              star <= score ? 'bg-rice-gold' : 'bg-gray-200'
            }`}
          />
        ))}
        <span className="text-xs font-bold text-rice-slate ml-2">{score}/5</span>
      </div>
    );
  };

  return (
    <div className="bg-rice-lightgreen/30 border border-rice-green/20 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <h4 className="text-base font-bold text-rice-slate flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-rice-gold" />
          <span>Bảng Đánh Giá Đặc Tính Gạo Thực Tế</span>
        </h4>
        <span className="text-xs bg-rice-green text-white font-semibold px-2.5 py-0.5 rounded-full">
          Kiểm Thử ISO 22000
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Metric Scores */}
        <div className="space-y-3.5">
          <div>
            <div className="flex justify-between text-xs font-semibold text-rice-slate mb-1">
              <span>Độ Dẻo (Stickiness):</span>
            </div>
            {renderStars(characteristics.stickiness)}
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-rice-slate mb-1">
              <span>Độ Thơm Tự Nhiên (Aroma):</span>
            </div>
            {renderStars(characteristics.aroma)}
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-rice-slate mb-1">
              <span>Độ Mềm Cơm (Softness):</span>
            </div>
            {renderStars(characteristics.softness)}
          </div>
        </div>

        {/* Origin & Grain Specs */}
        <div className="bg-white p-4 rounded-xl border border-rice-green/10 space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-gray-500 flex items-center gap-1.5 font-medium">
              <MapPin className="w-4 h-4 text-rice-green" />
              Nguồn Gốc Xuất Xứ:
            </span>
            <span className="font-bold text-rice-slate">{characteristics.originRegion}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-500 flex items-center gap-1.5 font-medium">
              <Calendar className="w-4 h-4 text-rice-green" />
              Mùa Vụ Thu Hoạch:
            </span>
            <span className="font-bold text-rice-slate">{characteristics.harvestSeason}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-500 flex items-center gap-1.5 font-medium">
              <Layers className="w-4 h-4 text-rice-green" />
              Chiều Dài Hạt Trung Bình:
            </span>
            <span className="font-bold text-rice-slate">{characteristics.grainLengthMm} mm</span>
          </div>
        </div>
      </div>
    </div>
  );
};
