import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import "./reserve.css"
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons"
import useFetch from "../../hooks/useFetch";
import { useContext, useState } from "react";
import { SearchContext } from "../../context/SearchContext"
import axios from "axios";
import { useNavigate } from "react-router-dom";
import React from 'react';


const Reserve = ({ setOpen, futsalId }) => {
    const [selectedSlots, setSelectedSlots] = useState([])

    const { data, loading, error } = useFetch(`/futsals/slots/${futsalId}`)
    ///yata error hunca sakxa slotma
    const { dates } = useContext(SearchContext)

    const getDateInRange = (startDate, endDate) => {
        const start = new Date(startDate)
        const end = new Date(endDate)
        const date = new Date(start.getTime());

        let list = []

        while (date <= end) { // Fix condition
            list.push(new Date(date).getTime()); // Fix .getTime() function call
            date.setDate(date.getDate() + 1);
        }
        return list
    };

    const alldates = getDateInRange(dates[0].startDate, dates[0].endDate)

    const isAvailable = (slotNumber) => {
        // Ensure slotNumber and unavailableDates exist before calling .some()
        if (!slotNumber || !slotNumber.unavailableDates) {
            return true; // Assume available if data is missing
        }

        const isFound = slotNumber.unavailableDates.some((date) =>
            alldates.includes(new Date(date).getTime())
        );

        return !isFound;
    };

    const handleSelect = (e) => {
        const checked = e.target.checked
        const value = e.target.value
        setSelectedSlots(checked
            ? [...selectedSlots, value]
            : selectedSlots.filter((item) => item !== value)
        );
    };

    const navigate = useNavigate()

    const handleClick = async () => {
        try {

            await Promise.all(
                selectedSlots.map(slotId => {
                    return axios.put(`/slots/availability/${slotId}`, { dates: alldates });
                })
            );
            setOpen(false)
            navigate("/")

        } catch (err) {

        }


    };

    return (
        <div className="reserve">
            <div className="rContainer">
                <FontAwesomeIcon icon={faCircleXmark}
                    className="rClose"
                    onClick={() =>
                        setOpen(false)}
                />

                <span> Select your slots:</span>
                {data.map(item => (
                    <div className="rItem">
                        <div className="rItemInfo">
                            <div className="rTitle">{item.title} </div>
                            <div className="rDesc"> {item.desc}</div>
                            <div className="rMax">Max people: <b> {item.maxPeople}</b>
                            </div>
                            <div className="rPrice"> {item.price}</div>
                        </div>
                        <div className="rSelectRooms">


                            {item.slotNumbers.map((slotNumber) => (
                                <div className="room">

                                    <label>{slotNumber.number}</label>
                                    <input type="checkbox" value={slotNumber._id} onChange={handleSelect}
                                        disabled={!isAvailable(slotNumber)}
                                    />



                                </div>
                            ))}
                        </div>

                    </div>

                ))}

                <button onClick={handleClick} className="rButton">Reserve Now!!</button>




            </div>
        </div>
    );
};

export default Reserve;