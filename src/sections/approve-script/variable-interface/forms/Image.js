import { useCallback, useEffect, useState } from 'react';
import { Upload } from 'src/components/upload';
import { useBoolean } from 'src/hooks/use-boolean';
import CustomLabel from '../components/CustomLabel';

const PropTypes = require('prop-types');
const {
  Stack,
  Chip,
  TextField,
  FormControlLabel,
  Switch,
  Typography,
  Card,
  CardContent,
} = require('@mui/material');

const Image = ({ template }) => {
  const preview = useBoolean();
  const [files, setFiles] = useState([]);

  const handleDropMultiFile = useCallback(
    (acceptedFiles) => {
      setFiles([
        ...files,
        ...acceptedFiles.map((newFile) =>
          Object.assign(newFile, {
            preview: URL.createObjectURL(newFile),
          })
        ),
      ]);
    },
    [files]
  );

  const handleRemoveFile = (inputFile) => {
    const filesFiltered = files.filter((fileFiltered) => fileFiltered !== inputFile);
    setFiles(filesFiltered);
  };

  const handleRemoveAllFiles = () => {
    setFiles([]);
  };

  useEffect(() => {
    setFiles(template?.config?.files || []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Stack>
      <CustomLabel nameLabel="InputTemplate">
        <Chip size="small" label="Input" color="primary" sx={{ width: '80px' }} />
      </CustomLabel>
      <CustomLabel nameLabel="Variables">
        <TextField
          size="small"
          placeholder="Enter value"
          defaultValue={template?.config?.variable?.key}
        />
      </CustomLabel>
      <CustomLabel nameLabel="Name">
        <TextField
          size="small"
          name="name"
          placeholder="Enter value"
          value={template?.config?.name}
          inputProps={{
            autoCorrect: 'off',
            spellCheck: 'false',
            autoCapitalize: 'none',
            'aria-autocomplete': 'none',
            'aria-expanded': false,
          }}
        />
      </CustomLabel>
      <Card
        sx={{
          bgcolor: 'transparent',
          boxShadow: 'none',
          p: 0,
          borderRadius: 1,
          overflow: 'visible',
        }}
      >
        <CardContent
          sx={{
            p: '0px!important',
            pt: 1,
          }}
        >
          <FormControlLabel
            control={<Switch checked={preview.value} onClick={preview.onToggle} />}
            label="Show Thumbnail"
          />
          <Upload
            accept={{ 'image/*': [] }}
            multiple
            thumbnail={preview.value}
            files={files}
            onDrop={handleDropMultiFile}
            onRemove={handleRemoveFile}
            onRemoveAll={handleRemoveAllFiles}
            sx={{
              '&.MuiBox-root h6': {
                maxWidth: 200,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              },
            }}
            stylePreview={{
              '& .MuiListItemText-root span': {
                maxWidth: 200,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              },
              ...(preview.value && {
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, 80px)',
                gap: '8px',
              }),
            }}
            placeholder={
              <Typography
                variant="h6"
                sx={{
                  py: 2,
                }}
              >
                Drop or Select image
              </Typography>
            }
          />
        </CardContent>
      </Card>
      <CustomLabel nameLabel="">
        <FormControlLabel
          label="Hide Label"
          control={<Switch name="hideLabel" checked={template?.config?.hideLabel} />}
        />
      </CustomLabel>
      <CustomLabel nameLabel="Label Width">
        <TextField
          type="number"
          size="small"
          name="labelWidth"
          placeholder="Enter value"
          value={template?.config?.labelWidth}
          inputProps={{
            autoCorrect: 'off',
            spellCheck: 'false',
            autoCapitalize: 'none',
            'aria-autocomplete': 'none',
            'aria-expanded': false,
          }}
        />
      </CustomLabel>
      <CustomLabel nameLabel="Width">
        <TextField
          type="number"
          size="small"
          name="width"
          placeholder="Enter value"
          value={template?.config?.width ?? ''}
          inputProps={{
            autoCorrect: 'off',
            spellCheck: 'false',
            autoCapitalize: 'none',
            'aria-autocomplete': 'none',
            'aria-expanded': false,
          }}
        />
      </CustomLabel>
      <CustomLabel nameLabel="Height">
        <TextField
          type="number"
          size="small"
          name="height"
          placeholder="Enter value"
          value={template?.config?.height ?? ''}
          inputProps={{
            autoCorrect: 'off',
            spellCheck: 'false',
            autoCapitalize: 'none',
            'aria-autocomplete': 'none',
            'aria-expanded': false,
          }}
        />
      </CustomLabel>
    </Stack>
  );
};

Image.propTypes = {
  template: PropTypes.object,
};

export default Image;
