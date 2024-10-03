"use client"
import React from 'react';
import celestialBodies from './celestialBodies'; 

const PlanetDescription = ({ selectedBody, onClose }) => {
if (!selectedBody) return null;

const bodyData = celestialBodies.find(body => body.name.toLowerCase() === selectedBody.toLowerCase());

return (
<div className="absolute top-0 w-72 h-full bg-black bg-opacity-70 text-white p-6 overflow-y-auto">
    <button 
    onClick={onClose}
    className="absolute top-4 right-4 text-white hover:text-gray-300"
    >
    ✕
    </button>
    <h2 className="text-4xl font-bold mb-4 mt-4">{bodyData.name}</h2>
    <p className="text-md mb-4">{bodyData.type}</p>
    <img 
    src={`${window.location.hostname === "thegrandmasons.github.io" ? "/orbit" : ""}/assets/Dimgs/${bodyData.name.toLowerCase()}.jpg`} 
    alt={bodyData.name} 
    className="w-full h-44 object-cover rounded-lg mb-4"
    />
    <p className="mb-4">{bodyData.description}</p>
    {bodyData.name !== "Sun" &&
    <div className="non-desc-items">
    <div className="mb-4">
        <h3 className="text-xl font-semibold mb-2">Length of Year</h3>
        <p>{bodyData.LoY} Earth days</p>
    </div>
    <div className="mb-4">
        <h3 className="text-xl font-semibold mb-2">Distance from Sun</h3>
        <p>{bodyData.DoS} AU</p>
    </div>
    
    <div>
    <h3 className="text-xl font-semibold mb-2">Moons</h3>
    <p>{bodyData.moons || 0}</p>
    </div>
    </div>
}
</div>
);
};

export default PlanetDescription;
