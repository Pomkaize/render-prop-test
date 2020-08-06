import React from 'react';
import ReactDOMServer from 'react-dom/server';

import {AppChildren} from './index';

ReactDOMServer.renderToStaticMarkup(<AppChildren /> );
