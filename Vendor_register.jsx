import React, { useState , useEffect } from 'react';
import './RegisterForm.css';
import axios from 'axios';

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

const RegistrationForm = () => {
  const [step, setStep] = useState(1);
  const [hotelImages, setHotelImages] = useState([]);
  const [propertyType, setPropertyType] = useState('');
  const [facilities, setFacilities] = useState([]);
  const [customFacility, setCustomFacility] = useState('');

  const [countries, setCountries] = useState([]);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/countries"); // Adjust base URL if needed
        setCountries(response.data);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    fetchCountries();
  }, []);

  const [cities, setCity] = useState([]);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/cities"); // Adjust base URL if needed
        setCity(response.data);
      } catch (error) {
        console.error("Error fetching cities:", error);
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

  const handleAddFacility = () => {
    const trimmed = customFacility.trim();
    if (trimmed && !facilities.includes(trimmed)) {
      setFacilities([...facilities, trimmed]);
      setCustomFacility('');
    }
  };

  const handleRemoveFacility = (facility) => {
    setFacilities(facilities.filter((f) => f !== facility));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    hotelImages.forEach((file) => {
      formData.append('images', file);
    });
    formData.append('propertyType', propertyType);
    formData.append('facilities', JSON.stringify(facilities));

    // Example: Post formData using fetch/axios
    // fetch('/your-api-endpoint', { method: 'POST', body: formData })

    alert('Form submitted!');
  };

  return (
    <div className="register-container">
      <h1 className="register-title">Add Your Hotel</h1>
      <div className="form-box">
        <form onSubmit={step === 2 ? handleSubmit : handleNext}>
          {step === 1 && (
            <>
              <label>Hotel Name:</label>
              <input type="text" placeholder="Enter hotel name" />

              <label>Vendor Name:</label>
              <input type="text" placeholder="Enter vendor name" />

              <label htmlFor="country">Select Country:</label>
      <select id="country" name="country">
        <option value="">--Select a country--</option>
        {countries.map((country) => (
          <option key={country._id} value={country.name}>
            {country.name} ({country.dialCode})
          </option>
        ))}
      </select>

      <label htmlFor="city">Select City:</label>
      <select id="city" name="city">
        <option value="">--Select a city--</option>
        {cities.map((city) => (
          <option key={city._id} value={city.city}>
            {city.city} ({city.dialCode})
          </option>
        ))}
      </select>

              

              <label>Location:</label>
              <input type="text" placeholder="Enter full address" />

              <label>Email:</label>
              <input type="email" placeholder="Enter email address" />

              <label>Phone:</label>
              <input type="tel" placeholder="Enter phone number" />

              <label>TIN No:</label>
              <input type="tel" placeholder="Enter TIN No" />

              <button type="submit">Next</button>
            </>
          )}

          {step === 2 && (
            <>
              <label>Property Type</label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
              >
                <option value="">Select Property Type</option>
                <option value="Hotels">Hotels</option>
                <option value="Apartments">Apartments</option>
                <option value="Guest houses">Guest houses</option>
                <option value="Hostels">Hostels</option>
                <option value="Homestays">Homestays</option>
                <option value="Bed and breakfasts">Bed and breakfasts</option>
                <option value="Villas">Villas</option>
                <option value="Resorts">Resorts</option>
                <option value="Lodges">Lodges</option>
                <option value="Holiday homes">Holiday homes</option>
                <option value="Campsites">Campsites</option>
                <option value="Capsule hotels">Capsule hotels</option>
                <option value="Farm stays">Farm stays</option>
                <option value="Love hotels">Love hotels</option>
              </select>

              <label>Room Type</label>
              <input type="text" placeholder="Room Type" />

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
                <button type="button" onClick={handleAddFacility}>
                  Add
                </button>
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
                    {facility}{' '}
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
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              <label>License Document Upload:</label>
              <input type="file" accept=".pdf,.jpg,.jpeg,.png" />

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
              <input type="file" accept="video/*" multiple />

              <div className="form-buttons">
                <button className="button3" onClick={handleBack}>
                  Back
                </button>
                <button className="button3" type="submit">
                  Send Request
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default RegistrationForm;





