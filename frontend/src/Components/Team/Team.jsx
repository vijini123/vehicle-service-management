import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';

const Team = () => {
  const [team, setTeam] = useState([]);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const response = await fetch('http://localhost:3500/api/v1/team/getAllTeams');
        const data = await response.json();

        if (response.ok) {
          setTeam(data);
           console.log(data);
          console.log(team);
        } else {
          console.error('Error fetching team members:', data.message);
        }
      } catch (err) {
        console.error('Error fetching team members:', err);
      }
    };

    fetchTeam();

  }, []);

  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    speed: 1000,
    swipeToSlide: true,
    autoplaySpeed: 2000,
    slidesToShow: 3,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          dots: true,
          infinite: true,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <Slider {...settings}>
      {team.length > 0 ? (
        team.map((teams) => (
          <div key={teams} className="fans py-4 px-3">
            <p>{teams.description}</p>
            <div className="d-flex align-items-center gap-4 mt-3">
              <img src={teams.photo} className="w-25 h-25 rounded-2" alt={teams.name} />
              <div>
                <h6 className="mb-0 mt-3">{teams.name}</h6>
                <p>{teams.role}</p>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p>Loading...</p>
      )}
    </Slider>
  );
};

export default Team;
