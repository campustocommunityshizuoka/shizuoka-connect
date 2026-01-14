"use client";

import { useState } from 'react';

type Props = {
  images: string[];
  name: string;
  description: string;
  url: string;
};

export default function PartnerCard({ images, name, description, url }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="partner-card card">
      <div className="slideshow-container" style={{ position: 'relative' }}>
        {/* 画像表示エリア */}
        {images.map((src, index) => (
          <div
            key={index}
            className={`slide ${index === currentIndex ? 'active-slide' : ''}`}
            style={{ 
                display: index === currentIndex ? 'flex' : 'none',
                width: '100%',
                height: '200px', // style.cssに依存しますが念のため
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'hidden'
            }}
          >
            <img src={src} alt={`${name}の写真${index + 1}`} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
        ))}

        {/* 矢印 (画像が2枚以上ある時だけ表示) */}
        {images.length > 1 && (
          <>
            <a className="prev" onClick={prevSlide} style={{ cursor: 'pointer' }}>&#10094;</a>
            <a className="next" onClick={nextSlide} style={{ cursor: 'pointer' }}>&#10095;</a>
          </>
        )}
      </div>

      <h4>{name}</h4>
      <p>{description}</p>
      
      <div className="partner-card-buttons">
        <a href={url} className="btn" target="_blank" rel="noopener noreferrer">
          <i className="fas fa-home"></i> ホームページ
        </a>
      </div>
    </div>
  );
}