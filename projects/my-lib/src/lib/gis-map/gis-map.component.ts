import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'lib-gis-map',
  templateUrl: './gis-map.component.html',
  styleUrls: ['./gis-map.component.css']
})
export class GisMapComponent implements OnInit {
  @Output() PassLatLong = new EventEmitter<any>();
  map: L.Map;
  clickedLocation: {
    lat: number;
    lng: number;
    address: string;
    state: any;
    state_district: any;
    county: any;
    road: any;
    suburb: any;
    Location_type: any;
    country: any;
  };
  latlong: L.LatLng;

  ngOnInit(): void {
    this.initMap();
  }

  private initMap(): void {
    // Center map on Ethiopia
    const ethiopiaCenter: L.LatLngExpression = [9.018866751136224, 38.75181836975695]; // Coordinates for Ethiopia
    const zoomLevel = 12; // Zoom level to show Ethiopia
  
    // Initialize map
    this.map = L.map('leafletMap').setView(ethiopiaCenter, zoomLevel);
  
    // Satellite imagery tile layer (adjust URL to your preferred provider)
    const satelliteLayer = L.tileLayer('https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      attribution: 'Map data &copy; Google'
    }).addTo(this.map);
  
    // Standard map tile layer (road names, etc.)
    const standardLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 20,
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
  
    // Add both layers to the map
    satelliteLayer.addTo(this.map);
    standardLayer.addTo(this.map);
  
    // Set up layer control (optional, to switch between layers)
    const baseLayers = {
      'Satellite': satelliteLayer,
      'Standard': standardLayer
    };
    L.control.layers(baseLayers).addTo(this.map);
  
    // Add marker for Ethiopia with custom icon (text label)
    const ethiopiaIcon = L.divIcon({
      className: 'text-label',
      html: '<div>Ethiopia</div>'
    });
    L.marker(ethiopiaCenter, { icon: ethiopiaIcon }).addTo(this.map);

    this.map.on('click', (e: L.LeafletMouseEvent) => {
      const latlng = e.latlng;
     this.latlong=latlng
      this.fetchLocationDetails(latlng);
      this.addClickMarker(latlng); // Add marker on click
      console.log(`Clicked at: ${latlng.lat}, ${latlng.lng}`);
    });
    // Define bounding box for Addis Ababa
    const addisAbabaBounds: [number, number][] = [
      [8.8415, 38.6568], // South West corner
      [9.1115, 38.8850]  // North East corner
    ];
  
    // Add click event listener
    this.map.on('click', (e: L.LeafletMouseEvent) => {
      const latlng = e.latlng;
  
      // Check if the clicked location is within Addis Ababa bounds
      if (this.isWithinBounds(latlng, addisAbabaBounds)) {
        // this.handleMapClick(latlng);
        this.latlong = latlng;
        console.log(`Clicked at: ${latlng.lat}, ${latlng.lng}`);
      } else {
        alert('Clicked location is outside Addis Ababa bounds.');
      }
    });
  }
  
  private isWithinBounds(latlng: L.LatLng, bounds: [number, number][]): boolean {
    const lat = latlng.lat;
    const lng = latlng.lng;
    const southWest = bounds[0];
    const northEast = bounds[1];
  
    return lat >= southWest[0] && lat <= northEast[0] && lng >= southWest[1] && lng <= northEast[1];
  }
  
  

  private fetchLocationDetails(latlng: L.LatLng): void {
    const geocodeUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latlng.lat}&lon=${latlng.lng}&addressdetails=1`;

    fetch(geocodeUrl)
      .then(response => response.json())
      .then(data => {
        console.log('Reverse Geocoding Result:', data);

        const addressDetails = data.address;
        const city = addressDetails.city || addressDetails.town || addressDetails.village || '';
        const country = addressDetails.country || '';
        const state = addressDetails.state || '';
        const state_district = addressDetails.state_district && addressDetails.state_district !== state ? addressDetails.state_district : '';
        const county = addressDetails.county || '';
        const road = addressDetails.road || '';
        const suburb = addressDetails.suburb || '';
        const Location_type = data.type || '';
        const address = addressDetails.road ? `${addressDetails.road}, ${city}, ${country}` : `${city}, ${country}`;

        this.clickedLocation = {
          lat: latlng.lat,
          lng: latlng.lng,
          address: address,
          state: state,
          state_district: state_district,
          county: county,
          road: road,
          suburb: suburb,
          Location_type: Location_type,
          country: country
        };
      })
      .catch(error => console.error('Error fetching geocode data:', error));
  }

  private addClickMarker(latlng: L.LatLng): void {
    const customIcon = L.icon({
      
      iconUrl: 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200', // Replace with the URL of your custom icon
      iconSize: [32, 32], // Size of the icon
      iconAnchor: [16, 32], // Point of the icon which will correspond to marker's location
      popupAnchor: [0, -32] // Point from which the popup should open relative to the iconAnchor
    });

    L.marker(latlng, { icon: customIcon }).addTo(this.map)
      .bindPopup('You clicked here!') // Optional: bind a popup
      .openPopup();
  }
  pass(){
    this.PassLatLong.emit(this.latlong);
  }
}
