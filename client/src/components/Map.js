import React, { useState, useEffect, useContext } from 'react';
import ReactMapGL, { NavigationControl, Marker, Popup } from 'react-map-gl';
import { withStyles } from '@material-ui/core/styles';
import differenceInMinutes from 'date-fns/difference_in_minutes';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import DeleteIcon from '@material-ui/icons/DeleteTwoTone';
import { Subscription } from 'react-apollo';

import { default as keysConfig } from '../keys.config';

import Context from '../context';
import {
  createDraft,
  updateDraft,
  setPins,
  setCurrentPin,
  deletePin,
  addPin,
  createComment,
} from '../context/actions';

import { useClient } from '../useClient';
import { getPinsQuery } from '../graphql/queries';
import { deletePinMutation } from '../graphql/mutations';
import {
  pinAddedSubscription,
  pinDeletedSubscription,
  pinUpdatedSubscription,
} from '../graphql/subscriptions';

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

  const client = useClient();

  const getUserPosition = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(({ coords: { latitude, longitude } }) => {
        setViewPort({ ...viewPort, latitude, longitude });
        setUserPosition({ latitude, longitude });
      });
    }
  };

  const getPins = async () => {
    const { getPins: pins } = await client.request(getPinsQuery);
    // console.log(pins);
    dispatch(setPins(pins));
  };

  useEffect(() => {
    getUserPosition();

    getPins();
  }, []);

  const handleMapOnClick = (event) => {
    const { lngLat, leftButton } = event;

    if (!leftButton) return;

    if (!state.draft) dispatch(createDraft());

    const [longitude, latitude] = lngLat;

    dispatch(updateDraft({ latitude, longitude }));
  };

  const highlightNewPin = pin =>
    differenceInMinutes(Date.now(), Number.parseInt(pin.createdAt)) <= 30 ? 'limegreen'
      : 'darkblue';

  const handlePinSelect = (pin) => {
    setPopup(pin);
    dispatch(setCurrentPin(pin));
  };

  const isAuthUser = () => state.currentUser._id === popup.author._id;

  const handlePopupClose = () => {
    setPopup(null)
    dispatch(setCurrentPin(null));
  };

  const handlePinDelete = async (pinId) => {
    const { deletePin: pin } = await client.request(deletePinMutation, { pinId });

    // dispatch(deletePin(pin));
    setPopup(null);
  };

  return (
    <div className={classes.root}>
      <ReactMapGL
        width='100vw'
        height='calc(100vh - 64px)'
        mapStyle='mapbox://styles/mapbox/streets-v9'
        mapboxApiAccessToken={keysConfig.MapboxAccessKey}
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
        {
          // created pins
          state.pins.map(pin => (
            <Marker
              key={pin._id}
              latitude={pin.latitude}
              longitude={pin.longitude}
              offsetLeft={-19}
              offsetTop={-37}
            >
              <PinIcon
                size={40}
                color={highlightNewPin(pin)}
                onClick={() => handlePinSelect(pin)}
              />
            </Marker>
          ))
        }
        {
          // popup dialog for created pins
          popup && (
            <Popup
              anchor='top'
              latitude={popup.latitude}
              longitude={popup.longitude}
              closeOnClick={false}
              onClose={() => handlePopupClose()}
            >
              <img
                className={classes.popupImage}
                src={popup.image}
                alt={popup.title}
              />
              <div className={classes.popupTab}>
                <Typography>
                  {popup.latitude.toFixed(6)}, {popup.longitude.toFixed(6)}
                </Typography>
                {
                  isAuthUser() && (
                    <Button
                      onClick={() => handlePinDelete(popup._id)}
                    >
                      <DeleteIcon
                        className={classes.deleteIcon}
                      />
                    </Button>
                  )
                }
              </div>
            </Popup>
          )
        }
      </ReactMapGL>
      {/* Apollo subscriptions */}
      <Subscription
        subscription={pinAddedSubscription}
        onSubscriptionData={({
          subscriptionData: {
            data: { pinAdded: pin },
          },
        }) => {
          // console.log({ pin });

          dispatch(addPin(pin));
        }}
      />
      <Subscription
        subscription={pinUpdatedSubscription}
        onSubscriptionData={({
          subscriptionData: {
            data: { pinUpdated: pin },
          },
        }) => {
          // console.log({ pin });

          dispatch(createComment(pin));
        }}
      />
      <Subscription
        subscription={pinDeletedSubscription}
        onSubscriptionData={({
          subscriptionData: {
            data: { pinDeleted: pin },
          },
        }) => {
          // console.log({ pin });

          dispatch(deletePin(pin));
        }}
      />
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
