import PropTypes from 'prop-types';
import 'src/utils/highlight';
import ReactQuill from 'react-quill';
// @mui
import { alpha } from '@mui/material/styles';
//
import { StyledEditor } from './styles';
import Toolbar, { formats } from './toolbar';

// ----------------------------------------------------------------------

export default function Editor({
  id = 'minimal-quill',
  error,
  simple = false,
  helperText,
  sx,
  readOnly = false,
  formatType,
  ...other
}) {
  const modules = {
    toolbar: readOnly
      ? false
      : {
          container: `#${id}`,
          handlers: {
            // ...(!formatType === 'base64' && {
            //   image: imageHandler,
            // }),
          },
        },
    history: {
      delay: 500,
      maxStack: 100,
      userOnly: true,
    },
    syntax: true,
    clipboard: {
      matchVisual: false,
    },
  };

  return (
    <>
      <StyledEditor
        sx={{
          ...(error && {
            border: (theme) => `solid 1px ${theme.palette.error.main}`,
            '& .ql-editor': {
              bgcolor: (theme) => alpha(theme.palette.error.main, 0.08),
            },
          }),
          ...sx,
        }}
      >
        {!readOnly && <Toolbar id={id} isSimple={simple} />}

        <ReactQuill
          modules={modules}
          formats={formats}
          placeholder="Write something awesome..."
          readOnly={readOnly}
          {...other}
        />
      </StyledEditor>

      {helperText && helperText}
    </>
  );
}

Editor.propTypes = {
  error: PropTypes.bool,
  helperText: PropTypes.object,
  id: PropTypes.string,
  formatType: PropTypes.string,
  simple: PropTypes.bool,
  sx: PropTypes.object,
  readOnly: PropTypes.bool,
};
