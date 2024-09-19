import React from 'react';
import Slider from 'react-slick';

const ComplaintSlider = ({ complaints }) => {
    const settings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
    };

    return (
        <div>
            <h3>Prijave smetnji</h3>
            <Slider {...settings}>
                {complaints.map((complaint) => (
                    <div key={complaint.id} className="complaint-card">
                        <h4>{complaint.sector}</h4>
                        <p>{complaint.description}</p>
                        <p><strong>Ime:</strong> {complaint.name}</p>
                        <p><strong>Email:</strong> {complaint.email}</p>
                        <p><strong>Status:</strong> {complaint.status}</p>
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default ComplaintSlider;
