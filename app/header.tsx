import React from 'react';

export default function Header() {
  return (
    <header className="bg-white text-white p-4">
      <div className="container mx-auto flex justify-between items-center text-black">
        <h1 className="text-2xl font-bold text-black">Roupas Fixes</h1>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <a href="#about" className="hover:text-gray-300">
                Sobre nós
              </a>
            </li>
            <li>
              <a href="#services" className="hover:text-gray-300">
                Contactos
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}