import React from 'react';
import ReactDOMServer from 'react-dom/server';

import {AppModalChildren} from './index';

ReactDOMServer.renderToStaticMarkup(<AppModalChildren /> );
