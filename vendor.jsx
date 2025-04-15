import "../Customer/customer.css"
import { useState, useEffect } from "react";
import axios from "axios";
import './vendor.css';

export default function Vendor() {
 
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/register');
      setHotels(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching hotels:', error);
      setError('Failed to fetch hotels. Please try again later.');
      setLoading(false);
    }
  };

  const handleViewDetails = (hotel) => {
    setSelectedHotel(hotel);
    setShowDetails(true);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedHotel(null);
  };


  const handleApprove = async () => {
    try {
      console.log('Attempting to approve hotel:', selectedHotel);
      const response = await axios.post('http://localhost:5000/api/hotels', selectedHotel, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('Approval response:', response);
      if (response.status === 201) {
        alert('Hotel approved successfully!');
        handleCloseDetails();
        // Refresh the hotels list
        fetchHotels();
      }
    } catch (error) {
      console.error('Error approving hotel:', error);
      console.error('Error response:', error.response);
      alert(error.response?.data?.message || 'Failed to approve the hotel. Please try again.');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <>
      <div>
        <div className='Addhtl'>
          <div>
            <h1>Vendor Requests</h1>
          </div>
          <div className='side-H'>
            <input type="text" placeholder="UserName/Email" className='htlsearch' />
          </div>
        </div>
        <div>
          <table className='hotel-table'>
            <thead>
              <tr className='t_display'>
                <th className='cus_th'>Hotel</th>
                <th className='cus_th'>Vendor</th>
                <th className='cus_th'>Location</th>
                <th className='cus_th'>City</th>
                <th className='cus_th'>Country</th>
                <th className='cus_th'>Request At</th>
                <th className='cus_th'>Action</th>
              </tr>
            </thead>
            <tbody>
              {hotels.map((hotel) => (
                <tr key={hotel._id} className='tn_display'>
                  <td className='cus_td'>{hotel.hotelName}</td>
                  <td className='cus_td'>{hotel.vendorName}</td>
                  <td className='cus_td'>{hotel.location}</td>
                  <td className='cus_td'>{hotel.city}</td>
                  <td className='cus_td'>{hotel.country}</td>
                  <td className='cus_td'>{new Date(hotel.createdAt).toLocaleDateString()}</td>
                  <td className='cus_td'>
                    <button onClick={() => handleViewDetails(hotel)} className='editt'>
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showDetails && selectedHotel && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Hotel Details</h2>
              <button className="close-button" onClick={handleCloseDetails}>×</button>
            </div>
            <div className="modal-body">
              <div className="detail-section">
                <h3>Basic Information</h3>
                <p><strong>Hotel Name:</strong> {selectedHotel.hotelName}</p>
                <p><strong>Vendor Name:</strong> {selectedHotel.vendorName}</p>
                <p><strong>Location:</strong> {selectedHotel.location}</p>
                <p><strong>City:</strong> {selectedHotel.city}</p>
                <p><strong>Country:</strong> {selectedHotel.country}</p>
              </div>

              <div className="detail-section">
                <h3>Contact Information</h3>
                <p><strong>Email:</strong> {selectedHotel.email}</p>
                <p><strong>Phone:</strong> {selectedHotel.phone}</p>
                <p><strong>TIN Number:</strong> {selectedHotel.tinNumber}</p>
              </div>

              <div className="detail-section">
                <h3>Property Details</h3>
                <p><strong>Property Type:</strong> {selectedHotel.propertyType}</p>
                <p><strong>Room Type:</strong> {selectedHotel.roomType}</p>
                <p><strong>Facilities:</strong> {selectedHotel.facilities.join(', ')}</p>
              </div>

              {selectedHotel.hotelImages && selectedHotel.hotelImages.length > 0 && (
                <div className="detail-section">
                  <h3>Images</h3>
                  <div className="image-grid">
                    {selectedHotel.hotelImages.map((image, index) => (
                      <img
                        key={index}
                        src={`http://localhost:5000/uploads/${image}`}
                        alt={`${selectedHotel.hotelName} - Image ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>
              )}

              {selectedHotel.licenseDocument && (
                <div className="detail-section">
                  <h3>License Document</h3>
                  <a 
                    href={`http://localhost:5000/uploads/${selectedHotel.licenseDocument}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="license-link"
                  >
                    View License Document
                  </a>
                </div>
              )}
              <div className="req_btn">
                <button className="req_btn2 red1">Reject</button>
                <button className="req_btn2" onClick={handleApprove}>Approve</button>

              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
