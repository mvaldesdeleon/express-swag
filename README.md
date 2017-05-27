# express-swag

From file to middleware in 6 seconds or less

```JS
const swag = require('express-swag');

// ...

// a json is fine too
swag('path/to/spec.yaml').then(middleware => {
    app.use(middleware);
    app.listen(80);
    // Profit
});
```

# install
with [npm](https://npmjs.org) do:

```
npm install express-swag
```

# license

MIT
