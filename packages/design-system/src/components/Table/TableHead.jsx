import PropTypes from 'prop-types';
import React from 'react';

export const TableHead = ({ children, _stackable, ...tableHeadProps }) => {
  const renderChildren = () => {
    return React.Children.map(children, (child) => {
      // Extend props before rendering.
      if (child) {
        return React.cloneElement(child, {
          _isTableHeadChild: true,
          _stackable: _stackable,
        });
      }
      return child;
    });
  };

  return <thead {...tableHeadProps}>{renderChildren()}</thead>;
};

TableHead.propTypes = {
  /**
   * The table head contents, usually `TableRow`.
   */
  children: PropTypes.node,
  /**
   * @hide-prop This gets set from the parent `Table` component
   */
  _stackable: PropTypes.bool,
};

export default TableHead;
