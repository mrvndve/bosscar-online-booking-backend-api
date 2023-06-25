// Copyright IBM Corp. and LoopBack contributors 2020. All Rights Reserved.
// Node module: @loopback/example-file-transfer
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {
  BindingScope,
  config,
  ContextTags,
  injectable,
  Provider,
} from '@loopback/core';
import multer from 'multer';
import {FILE_UPLOAD_SERVICE} from '../utilities/keys';
import {FileUploadHandler} from '../utilities/types';

/**
 * A provider to return an `Express` request handler from `multer` middleware
 */
@injectable({
  scope: BindingScope.TRANSIENT,
  tags: {[ContextTags.KEY]: FILE_UPLOAD_SERVICE},
})
export class FileUploadProvider implements Provider<FileUploadHandler> {
  constructor(@config() private options: multer.Options = {}) {
    if (!this.options.storage) {
      // Default to in-memory storage
      //   this.options.storage = multer.memoryStorage();

      this.options.storage = multer.diskStorage({
        destination: './public/uploads',
        filename: (req, file, cb) => {
          if (req.query.customFileName) {
            const {
              customFileName,
            } = req.query;

            cb(null, `${customFileName}`);
          } else {
            cb(null, Date.now() + '-' + file.originalname);
          }
        },
      });
    }
  }

  value(): FileUploadHandler {
    return multer(this.options).any();
  }
}
