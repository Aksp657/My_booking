import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import axios from 'axios';
import "./Active.css"

const API_URL = 'http://localhost:5000/api/hotels';


const ActiveHotels = () => {
  const [hotels, setHotels] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editHotelId, setEditHotelId] = useState(null);
  const [previewHotel, setPreviewHotel] = useState(null);
  
  const [newHotel, setNewHotel] = useState({
    name: '', location: '', vendor: '', phone: '', 
    joinedAt: '',  images: [], video: ''
  });

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    const res = await axios.get(API_URL);
    
        setHotels(res.data.filter(h => h.status));
  };

  

  
  const handleAddHotel = async () => {
    const res = await axios.post(API_URL, newHotel);
    setHotels([...hotels, res.data]);
    setShowAddModal(false);
    resetForm();
  };


  const handleUpdateHotel = async () => {
    const res = await axios.put(`${API_URL}/${editHotelId}`, newHotel);
    setHotels(hotels.map(h => h._id === editHotelId ? res.data : h));
    setShowEditModal(false);
    resetForm();
  };

 

  const handleEditHotel = (hotel) => {
    setNewHotel(hotel);
    setEditHotelId(hotel._id);
    setShowEditModal(true);
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const readers = files.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readers).then(results => {
      setNewHotel(prev => ({ ...prev, images: [...prev.images, ...results] }));
    });
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setNewHotel(prev => ({ ...prev, video: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const resetForm = () => {
    setNewHotel({
      name: '', location: '', vendor: '', phone: '', email: '',
      joinedAt: '', isFeatured: false, images: [], video: ''
    });
    setEditHotelId(null);
  };


  
  const handleStatusToggle = async (hotel) => {
  try {
    await axios.put(`${API_URL}/${hotel._id}`, { ...hotel, status: false });
    setHotels(hotels.filter(h => h._id !== hotel._id));
  } catch (error) {
    console.error('Error updating status:', error);
  }
};



  
  return (
    <div>
      <div className='Addhtl'>
        <div>
          <h1>Active Hotels</h1>
        </div>
        <div className='side-H'>
          <input type="text" placeholder="Search hotels..." className='htlsearch' />
          <button className='add_btn' onClick={() => setShowAddModal(true)}>
            <FaPlus /> Add Hotel
          </button>
        </div>
      </div>

      {/* Add Hotel Modal */}
      {showAddModal && (
        <div>
          <div className='inp_main'>
            <h2>Add New Hotel</h2>
            <div className='input_name'>
              <input className='inp' type="text" placeholder="Hotel Name" value={newHotel.name}
                onChange={(e) => setNewHotel({ ...newHotel, name: e.target.value })} />
              <input className='inp' type="text" placeholder="Location" value={newHotel.location}
                onChange={(e) => setNewHotel({ ...newHotel, location: e.target.value })} />
              <input className='inp' type="text" placeholder="Vendor" value={newHotel.vendor}
                onChange={(e) => setNewHotel({ ...newHotel, vendor: e.target.value })} />
              <input className='inp' type="tel" placeholder="Phone" value={newHotel.phone}
                onChange={(e) => setNewHotel({ ...newHotel, phone: e.target.value })} />
              <input className='inp' type="date" value={newHotel.joinedAt}
                onChange={(e) => setNewHotel({ ...newHotel, joinedAt: e.target.value })} />
              <label htmlFor="file-upload" className="custom-file-upload">
                📁 Upload Images
              </label>
              <input id='file-upload' className='inp' type="file" accept="image/*" multiple onChange={handleImageUpload} />
              {newHotel.images.length > 0 && <img src={newHotel.images[0]}  style={{ width: 80, height: 60, marginTop: 10 }} />}
              <label htmlFor="file-upload" className="custom-file-upload">
                📁 Upload Video
              </label>
              <input id='file-upload' className='inp' type="file" accept="video/*" onChange={handleVideoUpload} />
              {newHotel.video && (
                <video width="100" height="60" controls style={{ marginTop: 10 }}>
                  <source src={newHotel.video} />
                </video>
              )}
            </div>
            <div className="btn3_main">
              <button className='btn3' onClick={() => setShowAddModal(false)}>Cancel</button>
              <button className='btn3' onClick={handleAddHotel}>Add Hotel</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Hotel Modal */}
      {showEditModal && (
        <div>
          <div className='inp_main'>
            <h2>Edit Hotel</h2>
            <div className='input_name'>
              <input className='inp' type="text" placeholder="Hotel Name" value={newHotel.name}
                onChange={(e) => setNewHotel({ ...newHotel, name: e.target.value })} />
              <input className='inp' type="text" placeholder="Location" value={newHotel.location}
                onChange={(e) => setNewHotel({ ...newHotel, location: e.target.value })} />
              <input className='inp' type="text" placeholder="Vendor" value={newHotel.vendor}
                onChange={(e) => setNewHotel({ ...newHotel, vendor: e.target.value })} />
              <input className='inp' type="tel" placeholder="Phone" value={newHotel.phone}
                onChange={(e) => setNewHotel({ ...newHotel, phone: e.target.value })} />
              <input className='inp' type="date" value={newHotel.joinedAt}
                onChange={(e) => setNewHotel({ ...newHotel, joinedAt: e.target.value })} />

              <label htmlFor="file-upload" className="custom-file-upload">
                📁 Upload Images
              </label>
              <input id='file-upload' className='inp' type="file" accept="image/*" multiple onChange={handleImageUpload} />
              {newHotel.images.length > 0 && <img src={newHotel.images[0]}  style={{ width: 80, height: 60, marginTop: 10 }} />}
              <label htmlFor="file-upload" className="custom-file-upload">
                📁 Upload Video
              </label>
              <input id='file-upload' className='inp' type="file" accept="video/*" onChange={handleVideoUpload} />
              {newHotel.video && (
                <video width="100" height="60" controls style={{ marginTop: 10 }}>
                  <source src={newHotel.video} />
                </video>
              )}
            </div>
            <div className="btn3_main">
              <button className='btn3' onClick={() => setShowEditModal(false)}>Cancel</button>
              <button className='btn3' onClick={handleUpdateHotel}>Update Hotel</button>
            </div>
          </div>
        </div>
      )}

      {/* Hotels Table */}
      <div>
        <table className='hotel-table'>
          <thead>
            <tr className='t_display'>
              <th className='loc_th'>Image</th>
              <th className='loc_th'>Hotel Name</th>
              <th className='loc_th'>Location</th>
              <th className='loc_th'>Vendor</th>
              <th className='loc_th'>Phone</th>
              <th className='loc_th'>Joined At</th>
              <th className='loc_th'>Status</th>
              <th className='loc_th'>Edit</th>
            </tr>
          </thead>
          <tbody>
            {hotels.map((hotel) => (
              <tr className='tn_display' key={hotel.id}>
                <td className='loc_td'>
                  {hotel.images && hotel.images.length > 0 ? (
                    <img
                      src={hotel.images[0]}
                      alt={hotel.name}
                      style={{ width: '80px', height: '60px', objectFit: 'cover', cursor: 'pointer' }}
                      onClick={() => setPreviewHotel(hotel)}
                    />
                  ) : 'No Image'}
                </td>
                <td className='loc_td'>{hotel.name}</td>
                <td className='loc_td'>{hotel.location}</td>
                <td className='loc_td'>{hotel.vendor}</td>
                <td className='loc_td'>{hotel.phone}</td>
                <td className='loc_td'>{hotel.joinedAt}</td>
                <td className='loc_td'>
                  <label className="switch">
                 <input
                  type="checkbox"
                  checked={hotel.status}
                  onChange={() => handleStatusToggle(hotel)}
                  />

                    <span className="slider round"></span>
                  </label>
                </td>
                <td className='loc_td'>
                  <button className='edit' onClick={() => handleEditHotel(hotel)}>
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Preview Modal */}
      {previewHotel && (
        <div className="preview-modal">
          <div className="preview-content">
            <h3>{previewHotel.name}</h3>
            <div className="preview-grid">
              {previewHotel.images.map((img, idx) => (
                <img key={idx} src={img} alt={`img-${idx}`} style={{ width: '150px', margin: '10px' }} />
              ))}
              {previewHotel.video && (
                <video width="300" controls style={{ margin: '10px' }}>
                  <source src={previewHotel.video} />
                </video>
              )}
            </div>
            <button onClick={() => setPreviewHotel(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActiveHotels;

