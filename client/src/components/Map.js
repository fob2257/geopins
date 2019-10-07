import React, { useState, useEffect, useContext } from 'react';
import ReactMapGL, { NavigationControl, Marker, Popup } from 'react-map-gl';
import { withStyles } from '@material-ui/core/styles';
import differenceInMinutes from 'date-fns/difference_in_minutes';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/DeleteTwoTone';

import Context from '../context';
import {
  createDraft,
  updateDraft,
} from '../context/actions';

import PinIcon from './PinIcon';
import Blog from './Blog';

const initialViewPortState = {
  latitude: 37.7577,
  longitude: -122.4376,
  zoom: 13,
};

const Map = ({ classes }) => {
  const { state, dispatch } = useContext(Context);

  const [viewPort, setViewPort] = useState(initialViewPortState);
  const [userPosition, setUserPosition] = useState(null);
  const [popup, setPopup] = useState(null);

  const getUserPosition = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(({ coords: { latitude, longitude } }) => {
        setViewPort({ ...viewPort, latitude, longitude });
        setUserPosition({ latitude, longitude });
      });
    }
  };

  useEffect(() => {
    getUserPosition();
  }, []);

  const handleMapOnClick = (event) => {
    const { lngLat, leftButton } = event;

    if (!leftButton) return;

    if (!state.draft) dispatch(createDraft());

    const [longitude, latitude] = lngLat;

    dispatch(updateDraft({ latitude, longitude }));
  };

  return (
    <div className={classes.root}>
      <ReactMapGL
        width='100vw'
        height='calc(100vh - 64px)'
        mapStyle='mapbox://styles/mapbox/streets-v9'
        mapboxApiAccessToken='pk.eyJ1IjoiZm9iMjI1NyIsImEiOiJjanp5ZXBoNG8wMXBsM21wMnJidTZzemxoIn0.JXPHSnYq9fnEsaMVCkAO-A'
        onViewportChange={newViewPort => setViewPort(newViewPort)}
        onClick={handleMapOnClick}
        {...viewPort}
      >
        <div className={classes.navigationControl}>
          <NavigationControl
            onViewportChange={newViewPort => setViewPort(newViewPort)}
          />
        </div>
        {
          // pin for user's current position
          userPosition && (
            <Marker
              latitude={userPosition.latitude}
              longitude={userPosition.longitude}
              offsetLeft={-19}
              offsetTop={-37}
            >
              <PinIcon
                size={40}
                color='red'
              />
            </Marker>
          )
        }
        {
          // draft pin
          state.draft && (
            <Marker
              latitude={state.draft.latitude}
              longitude={state.draft.longitude}
              offsetLeft={-19}
              offsetTop={-37}
            >
              <PinIcon
                size={40}
                color='hotpink'
              />
            </Marker>
          )
        }
      </ReactMapGL>
      <Blog />
    </div>
  );
};

const styles = {
  root: {
    display: 'flex'
  },
  rootMobile: {
    display: 'flex',
    flexDirection: 'column-reverse'
  },
  navigationControl: {
    position: 'absolute',
    top: 0,
    left: 0,
    margin: '1em'
  },
  deleteIcon: {
    color: 'red'
  },
  popupImage: {
    padding: '0.4em',
    height: 200,
    width: 200,
    objectFit: 'cover'
  },
  popupTab: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column'
  }
};

export default withStyles(styles)(Map);
