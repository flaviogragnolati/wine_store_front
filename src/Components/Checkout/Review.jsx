import React, { useEffect } from 'react';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Grid from '@material-ui/core/Grid';
import { allProductsCartSelector, userSelector } from '../../selectors';
import { useDispatch, useSelector } from 'react-redux';
import { total } from '../utils/index';
import { getAllProductsCart } from '../../slices/productsCartSlice';
import { reviewStyles } from './checkoutHelpers';
import { useFormikContext } from 'formik';

export default function Review() {
  const { values: formValues } = useFormikContext();
  const {
    firstName,
    lastName,
    email,
    address,
    city,
    country,
    zip,
    cardName,
    cardNumber,
    expDate,
  } = formValues;

  const user = useSelector(userSelector);
  const dispatch = useDispatch();

  const payments = [
    //Info del formulario anterior
    { name: 'Titular', detail: cardName },
    { name: 'Número de Tarjeta', detail: cardNumber },
    { name: 'Válida hasta:', detail: expDate },
  ];

  const classes = reviewStyles();
  const AllProductsCart = useSelector(allProductsCartSelector);

  useEffect(() => {
    dispatch(getAllProductsCart(user.id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Resumen de orden{' '}
      </Typography>
      <List disablePadding>
        {AllProductsCart.map((product) => (
          <ListItem className={classes.listItem} key={product.name}>
            <ListItemText primary={product.name} secondary={product.quantity} />
            <Typography variant="body2">
              {product.price * product.quantity}
            </Typography>
          </ListItem>
        ))}
        <ListItem className={classes.listItem}>
          <ListItemText secondary="SubTotal" />
          <Typography variant="body2">{total(AllProductsCart)}</Typography>
        </ListItem>
        <ListItem className={classes.listItem}>
          <ListItemText secondary="IVA" />
          <Typography variant="body2">
            {Math.ceil((total(AllProductsCart) * 21) / 100)}
          </Typography>
        </ListItem>
        <ListItem className={classes.listItem}>
          <ListItemText primary="Total" />
          <Typography variant="subtitle1" className={classes.total}>
            {Math.ceil((total(AllProductsCart) * 121) / 100)}
          </Typography>
        </ListItem>
      </List>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Typography variant="h6" gutterBottom className={classes.title}>
            Envio{' '}
          </Typography>
          <Typography gutterBottom>{firstName + ' ' + lastName}</Typography>
          <Typography gutterBottom>{email}</Typography>
          <Typography gutterBottom>
            {address + ', ' + ', ' + city + ', ' + country + '. CP: ' + zip}
          </Typography>
        </Grid>
        <Grid item container direction="column" xs={12} sm={6}>
          <Typography variant="h6" gutterBottom className={classes.title}>
            Detalle de pago{' '}
          </Typography>
          <Grid container>
            {payments.map((payment, idx) => (
              <React.Fragment key={idx}>
                <Grid item xs={6}>
                  <Typography gutterBottom>{payment.name}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography gutterBottom>{payment.detail}</Typography>
                </Grid>
              </React.Fragment>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
