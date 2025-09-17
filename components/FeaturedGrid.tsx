
import React from 'react';

interface FeaturedGridProps {
  onFilterChange: (filterType: 'category' | 'brand', value: string) => void;
}

interface FeaturedItem {
  name: string;
  filterValue: string;
  filterType: 'category' | 'brand';
  imageUrl: string;
  neonShadow: string;
}

const featuredItems: FeaturedItem[] = [
  {
    name: 'ELFBAR: Potencia y Sabor',
    filterValue: 'ELFBAR',
    filterType: 'brand',
    imageUrl: 'https://static.wixstatic.com/media/597880_dff362317e884e5aab39f43dc40efa6a~mv2.png/v1/fit/w_500,h_500,q_90/file.png',
    neonShadow: '0 0 8px #8e44ad, 0 0 15px #8e44ad',
  },
  {
    name: 'IGNITE: Innovación Dual',
    filterValue: 'IGNITE',
    filterType: 'brand',
    imageUrl: 'https://static.wixstatic.com/media/597880_3010e4e6561c4a179418864a4e06a887~mv2.jpeg/v1/fit/w_500,h_500,q_90/file.jpeg',
    neonShadow: '0 0 8px #3498db, 0 0 15px #3498db',
  },
  {
    name: 'Opción 0% Nicotina',
    filterValue: 'BALI',
    filterType: 'brand',
    imageUrl: 'https://static.wixstatic.com/media/597880_0cc6d090c2c0424495599a8cae70b9c7~mv2.jpg/v1/fit/w_500,h_500,q_90/file.jpg',
    neonShadow: '0 0 8px #38bdf8, 0 0 15px #38bdf8',
  },
];

export const FeaturedGrid: React.FC<FeaturedGridProps> = ({ onFilterChange }) => {
  return (
    <section className="bg-dark-primary py-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 [perspective:1200px]">
          {featuredItems.map((item) => (
            <div
              key={item.name}
              className="relative rounded-lg overflow-hidden group cursor-pointer shadow-lg transition-transform duration-500 ease-in-out hover:shadow-2xl hover:[transform:rotateY(10deg)_scale(1.05)]"
              onClick={() => onFilterChange(item.filterType, item.filterValue)}
            >
              <img src={item.imageUrl} alt={item.name} className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-110 bg-white" />
              <div className="absolute inset-0 bg-black bg-opacity-50 group-hover:bg-opacity-60 transition-colors duration-300"></div>
              <div className="absolute inset-0 flex items-center justify-center p-4">
                <h3 
                    className="text-white text-2xl font-bold uppercase tracking-wider text-center"
                    style={{ textShadow: item.neonShadow }}
                >
                    {item.name}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
