# Proyecto de ingenieria de software

Este proyecto utiliza nodejs como lenguaje, ademas de Yarn Berry como manejador de paquetes. El servidor fue
desarrollado con express, postgresql y graphql. El cliente se desarrollo con create-react-app, antd y apollo

## Instalacion de dependencias

```
git clone git@github.com:vitico/Proyecto-Ingenieria-Software.git <folder>
cd <folder>
yarn install
cd packages/myapp
yarn install
```

> es necesario realizar 2 instalaciones debido a un error en el cliente que no he podido resolver

## Iniciar el sistema

podemos ejecutar `yarn start` para inciar el servidor y el cliente, o `yarn start:server` y `yarn start:client` para
iniciarlos por separado

```
yarn start
```

## configuracion sistema

para que el servidor funcione hay que modificar el archivo `packages/server/ormconfig.js` y poner los datos de la base
de datos. en el caso del cliente, se modificaria el archivo `packages/myapp/public/config.json` para indicarle la
direccion del servidor
