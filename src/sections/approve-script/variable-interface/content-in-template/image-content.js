import { Card, CardContent, Stack, Typography } from '@mui/material';
import { Upload } from 'src/components/upload';
import WithSectionAction from '../components/WithSelectionAction';

const PropTypes = require('prop-types');

const ImageContent = ({ data, selectingItem }) => (
  <WithSectionAction isActive={data.id === selectingItem?.id}>
    <Stack
      direction="row"
      alignItems="center"
      sx={{
        ...data?.styleDefault,
        width: '100%',
        overflow: 'hidden',
        height: `${data?.config?.height}px`,
        transition: 'all 0.3s',
        justifyContent: 'flex-start!important',
      }}
    >
      {!data?.config?.hideLabel && (
        <Typography
          sx={{
            minWidth: '100px',
            width: `${data?.config?.labelWidth}px`,
            transition: 'all 0.3s',
            flexShrink: 0,
          }}
        >
          {data?.config?.name}
        </Typography>
      )}

      <Card
        sx={{
          bgcolor: 'transparent',
          boxShadow: 'none',
          p: 0,
          borderRadius: 1,
          overflow: 'visible',
          transition: 'all 0.3s',
          ...(data?.config?.width
            ? {
                width: `${data?.config?.width}px`,
              }
            : {
                width: 'fit-content',
              }),
        }}
      >
        <CardContent
          sx={{
            p: '0px!important',
            pt: 1,
          }}
        >
          <Upload
            accept={{ 'image/*': [] }}
            multiple
            thumbnail
            disabled={{}}
            files={data?.config?.files}
            stylePreview={{
              display: 'none',
            }}
            placeholder={
              <Typography
                variant="h6"
                sx={{
                  p: 1,
                }}
              >
                Drop or Select image
              </Typography>
            }
          />
        </CardContent>
      </Card>
    </Stack>
  </WithSectionAction>
);

ImageContent.propTypes = {
  data: PropTypes.object,
  selectingItem: PropTypes.object,
};

export default ImageContent;
