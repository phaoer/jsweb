# `jsweb` - A collection of tools for JavaScript

## Installation

```bash
npm i @phaoerjs/jsweb
```

## Useage

- **CommonJs**

```javascript
const jsweb from "@phaoerjs/jsweb";
```

- **ESM**

```javascript
import { Request } from "@phaoerjs/jsweb";
```

- **Html**

```html
<script src="dist/index.js"></script>
<script>
	console.log(jsweb);
</script>
```

## Api

- Request
  http request client base on [axios](https://github.com/axios/axios)
  | **parameter** | **type** | **default** | **isrequired**
  |:----------|:----------|:----------|:----------
  | `url` | string | '' | true
  | `method` | string | get | false
  | `data` | object | {} | false
  | `cancel_tip` | boolean | false | false
  | `option` | axios.option | {} | false

  ```jsx
  ...
  useEffect(() => {
    const req = new Request({
        url: "xxxxxxx",
        data: {
            page: 1,
            page_size: 10,
            cancel_tip: true
        }
    });

    const getData = async () => {
        try {
            const res = await req.send();
            // if parameter cancel_tip is set true. you will get property 'request_is_cancel' from result when http request is canceled
            if(res.request_is_cancel) {
                console.log("request cancel");
            } else if(res.code === 200) {
                //do something
            } else {
                throw new Error(res.msg);
            }
        } catch (error) {
            message.error(catchErrorHandle(error));
        }
    }

    getData();

    return () => {
        req.cancel();
    }
  }, [])
  ...
  ```

- catchErrorHandle
  you can use this method to resolve all error types

  ```javascript
  catchErrorHandle(error);
  ```

- getTerminal

  ```javascript
  getTerminal();
  // { mobile: true, ios: true, android: false, ....}
  ```

- dateFormate

  ```javascript
  dateFormate("yyyy-MM-DD HH:mm:ss", date || null);
  // 2023-xx-xx xx:xx:xx
  ```

- getEndTime
  ```javascript
  getEndTime("2023-xx-xx xx:xx:xx", timestamp || null);
  // { str: "x天x时x分x秒", day: "x", hour: "x", min: "x", sec: "x" }
  ```
- Base64Encode

  ```javascript
  Base64Encode(1111);
  // MTExMTE=
  ```

- Base64Decode

  ```javascript
  Base64Decode("MTExMTE=");
  // 11111
  ```

- throttle

  ```javascript
  throttle(fn, wait);
  // 11111
  ```

- debounce

  ```javascript
  debounce(fn, wait, immediate);
  // 11111
  ```
