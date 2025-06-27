import { Stack, Typography } from '@mui/material';
import PropTypes from 'prop-types';

import DividerContent from './content-in-template/divider-content';
import InputContent from './content-in-template/input-content';
import SelectContent from './content-in-template/select-content';
import CheckboxContent from './content-in-template/checkbox-content';
import SwitchContent from './content-in-template/switch-content';
import AlertContent from './content-in-template/alert-content';
import InlineContent from './content-in-template/inline-content';
import RadioContent from './content-in-template/radio-content';
import TextareaContent from './content-in-template/textarea-content';
import LinkContent from './content-in-template/link-content';
import TextContent from './content-in-template/text-content';
import InputNumberContent from './content-in-template/input-number-content';
import SliderContent from './content-in-template/slider-content';
import FileContent from './content-in-template/file-content';
import ImageContent from './content-in-template/image-content';
import HtmlContent from './content-in-template/html-content';
import RangeContent from './content-in-template/range-content';

export const contentMap = {
  Alert: AlertContent,
  Divider: DividerContent,
  Inline: InlineContent,
  Input: InputContent,
  'Input Number': InputNumberContent,
  Textarea: TextareaContent,
  Select: SelectContent,
  Checkbox: CheckboxContent,
  Radio: RadioContent,
  Switch: SwitchContent,
  Slider: SliderContent,
  Range: RangeContent,
  Link: LinkContent,
  Text: TextContent,
  File: FileContent,
  Image: ImageContent,
  Html: HtmlContent,
};

const showValueHasMinMax = ([min, max], value, valueDefault = '100%', typeReturn = 'string') => {
  if (!value) {
    return valueDefault;
  }

  let result;

  if (value < min) {
    result = min;
  } else if (value > max) {
    result = max;
  } else {
    result = value;
  }

  return typeReturn === 'string' ? `${result}px` : result;
};

const SortableGroup = ({ group, level = 0, selectingItem, clickOnItem, gutter = true }) => {
  const { children, id, config } = group;

  const handleChoose = (clickId) => {
    clickOnItem(clickId);
  };

  return (
    <Stack
      className={`item-flow-template ${selectingItem?.id === id ? 'isSelecting' : ''}`}
      sx={{
        border: '1px solid',
        borderColor: 'text.disabled',
        borderStyle: level > 0 ? 'dashed' : '',
        height: 1,
        overflow: 'auto',
        ...(!gutter && {
          mb: '0px!important',
        }),
      }}
    >
      <Stack direction="row" alignItems="center" sx={{ width: '100%', position: 'relative' }}>
        {level > 0 && !config?.hideLabel && (
          <Typography
            sx={{
              minWidth: '100px',
              width: `${config?.labelWidth}px`,
              transition: 'all 0.3s',
              flexShrink: 0,
            }}
          >
            {config?.name}
          </Typography>
        )}
        <Stack
          sx={{
            flex: '1',
            borderRadius: level !== 0 ? 1 : 0,
            border: level !== 0 && config?.showBorder && '1px solid',
            borderColor: 'text.secondary',
            padding: level !== 0 && '10px',
            height: (level !== 0 && showValueHasMinMax([100, 1000], config?.height)) || 'auto',
            minHeight: '100px',
            maxWidth: showValueHasMinMax([100, 1000], config?.width),
            '& > div:first-of-type': {
              gap: group.name === 'Grid' && (config?.gap || 1),
            },
          }}
          className={group.name === 'Grid' && 'grid-option'}
        >
          <Stack
            style={{
              height: level === 0 && 'calc(100vh - 240px)',
            }}
          >
            {children.map((c) => {
              let content;

              if (c.type === 'GROUP')
                content = (
                  <SortableGroup
                    group={c}
                    level={level + 1}
                    selectingItem={selectingItem}
                    clickOnItem={clickOnItem}
                  />
                );
              if (c.type === 'ITEM') {
                const ContentComponent = contentMap[c.name];
                content = (
                  <Stack
                    className={`${c.class} shared item ${selectingItem} ${
                      (level + 1) % 2 === 0 ? 'bg' : ''
                    } `}
                  >
                    {ContentComponent && (
                      <ContentComponent data={c} selectingItem={selectingItem} />
                    )}
                  </Stack>
                );
              }

              return (
                <Stack
                  key={c.id}
                  className={`common-item ${level > 0 ? c.class : ''} ${
                    c.isChildGrid && 'is-child-grid'
                  }`}
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    handleChoose(c.id);
                  }}
                >
                  {content}
                </Stack>
              );
            })}
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default SortableGroup;

SortableGroup.propTypes = {
  group: PropTypes.object,
  level: PropTypes.number,
  selectingItem: PropTypes.object,
  clickOnItem: PropTypes.func,
  gutter: PropTypes.bool,
};
