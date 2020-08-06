import React from 'react';
import ReactDOMServer from 'react-dom/server';

import {AppModalRenderPropChildren} from './index';

ReactDOMServer.renderToStaticMarkup(<AppModalRenderPropChildren /> );
