import React, { useState, useEffect } from "react";
import $ from "jquery";

import AttachFileOutlinedIcon from "@mui/icons-material/AttachFileOutlined";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import WallpaperIcon from "@mui/icons-material/Wallpaper";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";

import backgrounds from "../settings";

export default function Footer(props) {
  const [isAudio, setAudio] = useState(!props.createMode);
  // const [audioSrc, setAudioSrc] = useState("");
  const [muteAudio, setMuteAudio] = useState(false);
  const [reRender, setRender] = useState(false);
  const [isWeather, setWeather] = useState(props.createMode);
  const [isPrivate, setPrivate] = useState(props.entryData.private);

  useEffect(() => {
    if (reRender) {
      setRender((prev) => {
        return !prev;
      });
    }
  });

  // useEffect(() => {
  //   if (renderBkg === true && props.createMode === false) {
  //     setRenBkg(false);
  //     setBackground(props.entryData.backgroundImage);
  //   }
  // });
  if (!props.createMode) setBackground(props.entryData.backgroundImage);

  useEffect(() => {
    // console.log("finna get da weather");
    if (isWeather === true) {
      // console.log("in true");
      var getIP = "http://ip-api.com/json/";
      var openWeatherMap = "http://api.openweathermap.org/data/2.5/weather";
      $.getJSON(getIP).done(function (location) {
        $.getJSON(openWeatherMap, {
          lat: location.lat,
          lon: location.lon,
          units: "metric",
          appid: "45014d735557d276c6086a85e85ce49b",
        }).done(function (weather) {
          // console.log(weather);
          // setUserWeather({
          //   desc: weather.weather[0].main,
          //   icon: weather.weather[0].icon,
          // });
          props.setEnv(time, {
            desc: weather.weather[0].main,
            icon: weather.weather[0].icon,
          });
        });
      });
      setWeather(false);
    }
  });

  function getBackgroundAudio(event) {
    console.log("in get bkg aud");
    const file = event.target.files;
    var reader = new FileReader();
    reader.readAsDataURL(file[0]);
    reader.onload = function () {
      // setAudioSrc(reader.result);
      setAudio(true);
      props.addBkgAudio(reader.result);
    };
  }

  function muteBkg() {
    console.log("in muteBkg");
    setMuteAudio((prev) => {
      return !prev;
    });
    setRender((prev) => {
      return !prev;
    });
  }

  function setBackground(index) {
    console.log("in set back: " + index + " " + typeof index);
    if (index === "" || index === undefined) return;
    let i = 0;
    if (props.createMode === true) i = index;
    else i = index;
    const imageUrl = "./../images/bkg" + i + ".jpg";
    $("body").css("background-image", "url(" + imageUrl + ")");
    if (props.createMode === true) props.addBkgImage(i);
  }

  function toggleVisibility() {
    props.switchVisibility(!isPrivate);
    setPrivate((prev) => {
      return !prev;
    });
  }

  const now = new Date().toDateString();
  const [time, setTime] = useState(now);
  function updateTime() {
    setTime(new Date().toDateString());
  }

  let weatherIcon = "";

  if (props.entryData.weather.icon !== undefined) {
    weatherIcon =
      "http://openweathermap.org/img/wn/" +
      props.entryData.weather.icon +
      "@2x.png";
  }

  return (
    <div className="footer px-5" id="footer">
      <div className="row mx-0">
        <div className="col-9">
          <span className="date-p">{time}</span>
          <span className="date-p mx-2">|</span>
          <span className="date-p me-1">
            <img className="weatherIcon" src={weatherIcon} alt="UwU" />
          </span>
          <span className="date-p">{props.entryData.weather.desc}</span>
          <span className="date-p mx-2">|</span>
          {props.createMode ? (
            <span>
              <span
                className="date-p"
                data-toggle="tooltip"
                data-placement="top"
                title="Attach media files"
              >
                <label htmlFor="files">
                  <AttachFileOutlinedIcon fontSize="small"></AttachFileOutlinedIcon>
                </label>
              </span>
              <span className="date-p mx-2">|</span>
              <span className="date-p">
                <input
                  onChange={getBackgroundAudio}
                  className="noDisplay"
                  type="file"
                  id="bkgAudio"
                  name="bkgAudio"
                  accept="audio/*"
                />

                <label
                  htmlFor="bkgAudio"
                  data-toggle="tooltip"
                  data-placement="top"
                  title="Add background audio"
                >
                  <MusicNoteIcon fontSize="small"></MusicNoteIcon>
                </label>
              </span>
              <span className="date-p mx-2">|</span>
            </span>
          ) : null}

          {isAudio && !muteAudio ? (
            <audio className="noDisplay" autoPlay loop>
              <source
                src={props.entryData.backgroundAudio}
                type="audio/mpeg"
              ></source>
            </audio>
          ) : null}

          <span
            className="date-p"
            onClick={muteBkg}
            data-toggle="tooltip"
            data-placement="top"
            title="Toggle background audio"
          >
            {muteAudio ? (
              <VolumeOffIcon fontSize="small"></VolumeOffIcon>
            ) : (
              <VolumeUpIcon fontSize="small"></VolumeUpIcon>
            )}
          </span>
          <span className="date-p mx-2">|</span>
          {props.createMode ? (
            <div className="dropdown my-dropdown">
              <a
                className="btn btn-sm bkg-btn"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                data-toggle="tooltip"
                data-placement="top"
                title="Change background image"
              >
                <WallpaperIcon
                  className="date-p"
                  fontSize="small"
                ></WallpaperIcon>
              </a>
              <ul className="dropdown-menu my-dropdown-menu">
                {backgrounds.map((background, index) => {
                  return (
                    <li
                      onClick={() => {
                        setBackground(index);
                      }}
                      key={index}
                    >
                      <img
                        className="dropdown-item"
                        src={"./../images/" + background + ".jpg"}
                      ></img>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : null}
          {props.createMode ? (
            <div className="d-inline">
              <span className="date-p mx-2">|</span>
              <span
                className="date-p"
                onClick={toggleVisibility}
                data-toggle="tooltip"
                data-placement="top"
                title={"This post is " +( isPrivate ? "private" : "public")}
              >
                {isPrivate ? (
                  <VisibilityOffOutlinedIcon fontSize="small" />
                ) : (
                  <VisibilityOutlinedIcon fontSize="small" />
                )}
              </span>
            </div>
          ) : null}
        </div>
        <div className="col-3 return-button">
          <span
            className="date-p"
            onClick={() => {
              props.return();
            }}
          >
            Return
          </span>
        </div>
      </div>
    </div>
  );
}
