import React, { useState, useEffect } from 'react';
import './RegisterForm.css';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/hotels';
const facilityOptions = [
  'Parking',
  'Restaurant',
  'Pets allowed',
  'Room service',
  '24-hour front desk',
  'Fitness centre',
  'Non-smoking rooms',
  'Airport shuttle',
  'Spa and wellness centre',
  'Free WiFi',
  'Electric vehicle charging station',
  'Wheelchair accessible',
  'Swimming Pool',
];

const roomtypeOptions = [
  'Single Room',
  'Double Room',
  'Triple Room',
  'Family Room',
  'Suite',
  'Deluxe Room',
];

const RegistrationForm = () => {
  const [step, setStep] = useState(1);
  const [hotelImages, setHotelImages] = useState([]);
  const [hotelVideos, setHotelVideos] = useState([]);
  const [licenseDocumentFile, setLicenseDocumentFile] = useState(null);

  const [hotelName, setHotelName] = useState('');
  const [vendorName, setVendorName] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [location, setLocation] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [tinNumber, setTinNumber] = useState('');
  const [propertyType, setPropertyType] = useState('');

  const [facilities, setFacilities] = useState([]);
  const [customFacility, setCustomFacility] = useState('');
  const [roomtypes, setRoomType] = useState([]);
  const [customRoomType, setCustomRoomType] = useState('');

  const [countries, setCountries] = useState([]);
  const [cities, setCity] = useState([]);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/countries');
        setCountries(response.data);
      } catch (error) {
        console.error('Error fetching countries:', error);
      }
    };
    fetchCountries();
  }, []);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/cities');
        setCity(response.data);
      } catch (error) {
        console.error('Error fetching cities:', error);
      }
    };
    fetchCities();
  }, []);

  const handleNext = (e) => {
    e.preventDefault();
    setStep(step + 1);
  };

  const handleBack = (e) => {
    e.preventDefault();
    setStep(step - 1);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setHotelImages(files);
  };

  const handleVideoChange = (e) => {
    const files = Array.from(e.target.files);
    setHotelVideos(files);
  };

  const handleAddFacility = () => {
    const trimmed = customFacility.trim();
    if (trimmed && !facilities.includes(trimmed)) {
      setFacilities([...facilities, trimmed]);
      setCustomFacility('');
    }
  };
   const handleAddRoomType = () => {
    const trimmed = customFacility.trim();
    if (trimmed && !facilities.includes(trimmed)) {
      setFacilities([...facilities, trimmed]);
      setCustomFacility('');
    }
  };

  const handleRemoveFacility = (facility) => {
    setFacilities(facilities.filter((f) => f !== facility));
  };

  const handleRemoveRoomType = (roomType) => {
    setRoomType(roomtypes.filter((f) => f !== roomType));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('hotelName', hotelName);
    formData.append('vendorName', vendorName);
    formData.append('country', selectedCountry);
    formData.append('city', selectedCity);
    formData.append('location', location);
    formData.append('email', email);
    formData.append('phone', phone);
    formData.append('tinNumber', tinNumber);
    formData.append('propertyType', propertyType);
    formData.append('roomType', JSON.stringify(roomtypes));
    formData.append('facilities', JSON.stringify(facilities));

    if (licenseDocumentFile) formData.append('licenseDocument', licenseDocumentFile);
    hotelImages.forEach(file => formData.append('images', file));
    hotelVideos.forEach(file => formData.append('videos', file));

    try {
      const res = await axios.post('http://localhost:5000/api/register', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log(res.data);
      alert('Hotel registered successfully!');
      // Reset form or redirect after successful registration
    } catch (error) {
      console.error('Error submitting form:', error);
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        const errorMessage = error.response.data.message || 'Error submitting form';
        const errorDetails = error.response.data.errors ? 
          `\nDetails: ${error.response.data.errors.join(', ')}` : '';
        alert(`${errorMessage}${errorDetails}`);
      } else if (error.request) {
        // The request was made but no response was received
        alert('No response from server. Please check your connection.');
      } else {
        // Something happened in setting up the request that triggered an Error
        alert('Error setting up the request. Please try again.');
      }
    }
  };

  return (
    <div className="register-container">
      <h1 className="register-title">Add Your Hotel</h1>
      <div className="form-box">
        <form onSubmit={step === 2 ? handleSubmit : handleNext}>
          {step === 1 && (
            <>
              <label>Hotel Name:</label>
              <input
                type="text"
                placeholder="Enter hotel name"
                value={hotelName}
                onChange={(e) => setHotelName(e.target.value)}
              />

              <label>Vendor Name:</label>
              <input
                type="text"
                placeholder="Enter vendor name"
                value={vendorName}
                onChange={(e) => setVendorName(e.target.value)}
              />

              <label htmlFor="country">Select Country:</label>
              <select
                id="country"
                name="country"
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
              >
                <option value="">--Select a country--</option>
                {countries.map((country) => (
                  <option key={country._id} value={country.name}>
                    {country.name} ({country.dialCode})
                  </option>
                ))}
              </select>

              <label htmlFor="city">Select City:</label>
              <select
                id="city"
                name="city"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
              >
                <option value="">--Select a city--</option>
                {cities.map((city) => (
                  <option key={city._id} value={city.city}>
                    {city.city} ({city.dialCode})
                  </option>
                ))}
              </select>

              <label>Location:</label>
              <input
                type="text"
                placeholder="Enter full address"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />

              <label>Email:</label>
              <input
                type="email"
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <label>Phone:</label>
              <input
                type="tel"
                placeholder="Enter phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />

              <label>TIN No:</label>
              <input
                type="tel"
                placeholder="Enter TIN No"
                value={tinNumber}
                onChange={(e) => setTinNumber(e.target.value)}
              />

              <button type="submit">Next</button>
            </>
          )}

          {step === 2 && (
            <>
              <label>Property Type:</label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
              >
                <option value="">Select Property Type</option>
                {[
                  'Hotels', 'Apartments', 'Guest houses', 'Hostels', 'Homestays',
                  'Bed and breakfasts', 'Villas', 'Resorts', 'Lodges',
                  'Holiday homes', 'Campsites', 'Capsule hotels',
                  'Farm stays', 'Love hotels'
                ].map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>

              
              
              <label>Room Type:</label>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                <select
                  value=""
                  onChange={(e) => {
                    const selected = e.target.value;
                    if (selected && !roomtypes.includes(selected)) {
                      setRoomType([...roomtypes, selected]);
                    }
                  }}
                >
                  <option value="">Select from list</option>
                  {roomtypeOptions.map((roomType, index) => (
                    <option key={index} value={roomType}>
                      {roomType}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                <input
                  type="text"
                  value={customRoomType}
                  onChange={(e) => setCustomRoomType(e.target.value)}
                  placeholder="Add custom facility"
                />
                <button type="button" onClick={handleAddRoomType}>Add</button>
              </div>

              <div className="selected-facilities" style={{ marginBottom: '15px' }}>
                {roomtypes.map((roomType, index) => (
                  <span
                    key={index}
                    style={{
                      display: 'inline-block',
                      backgroundColor: '#f0f0f0',
                      padding: '5px 10px',
                      borderRadius: '15px',
                      marginRight: '5px',
                      marginBottom: '5px',
                      fontSize: '14px',
                    }}
                  >
                    {roomType}
                    <button
                      type="button"
                      onClick={() => handleRemoveRoomType(roomType)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'red',
                        marginLeft: '5px',
                        cursor: 'pointer',
                      }}
                    >×</button>
                  </span>
                ))}
              </div>

              <label>Facilities:</label>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                <select
                  value=""
                  onChange={(e) => {
                    const selected = e.target.value;
                    if (selected && !facilities.includes(selected)) {
                      setFacilities([...facilities, selected]);
                    }
                  }}
                >
                  <option value="">Select from list</option>
                  {facilityOptions.map((facility, index) => (
                    <option key={index} value={facility}>
                      {facility}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                <input
                  type="text"
                  value={customFacility}
                  onChange={(e) => setCustomFacility(e.target.value)}
                  placeholder="Add custom facility"
                />
                <button type="button" onClick={handleAddFacility}>Add</button>
              </div>

              <div className="selected-facilities" style={{ marginBottom: '15px' }}>
                {facilities.map((facility, index) => (
                  <span
                    key={index}
                    style={{
                      display: 'inline-block',
                      backgroundColor: '#f0f0f0',
                      padding: '5px 10px',
                      borderRadius: '15px',
                      marginRight: '5px',
                      marginBottom: '5px',
                      fontSize: '14px',
                    }}
                  >
                    {facility}
                    <button
                      type="button"
                      onClick={() => handleRemoveFacility(facility)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'red',
                        marginLeft: '5px',
                        cursor: 'pointer',
                      }}
                    >×</button>
                  </span>
                ))}
              </div>

              <label>License Document Upload:</label>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => setLicenseDocumentFile(e.target.files[0])}
              />

              <label>Hotel Images:</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
              />

              <div className="image-preview">
                {hotelImages.map((file, index) => (
                  <img
                    key={index}
                    src={URL.createObjectURL(file)}
                    alt={`Preview ${index}`}
                    style={{ width: '100px', margin: '5px' }}
                  />
                ))}
              </div>

              <label>Hotel Videos:</label>
              <input
                type="file"
                accept="video/*"
                multiple
                onChange={handleVideoChange}
              />

              <div className="form-buttons">
                <button className="button3" onClick={handleBack}>Back</button>
                <button className="button3" type="submit">Send Request</button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default RegistrationForm;
