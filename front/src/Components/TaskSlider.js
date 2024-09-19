import React from 'react';
import Slider from 'react-slick';

const TaskSlider = ({ tasks }) => {
    const settings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
    };

    return (
        <div>
            <h3>Taskovi</h3>
            <Slider {...settings}>
                {tasks.map((task) => (
                    <div key={task.id} className="task-card">
                        <h4>{task.name}</h4>
                        <p>{task.description}</p>
                        <p><strong>Prioritet:</strong> {task.priority}</p>
                        <p><strong>Status:</strong> {task.status}</p>
                        <p><strong>Radnik:</strong> {task.workerName}</p>
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default TaskSlider;
