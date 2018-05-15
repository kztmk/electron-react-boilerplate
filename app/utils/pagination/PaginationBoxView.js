// @flow
import React, { Component } from 'react';
import PageView from './PageView';
import BreakView from './BreakView';

type Props = {
  pageCount: number,
  pageRangeDisplayed: number,
  marginPagesDisplayed: number,
  previousLabel?: string,
  nextLabel?: string,
  breakLabel?: React.Element,
  hrefBuilder?: () => void,
  onPageChange?: () => void,
  initialPage?: number,
  forcePage?: number,
  disableInitialCallback?: boolean,
  containerClassName?: string,
  pageClassName?: string,
  pageLinkClassName?: string,
  activeClassName?: string,
  previousClassName?: string,
  nextClassName?: string,
  previousLinkClassName?: string,
  nextLinkClassName?: string,
  disabledClassName?: string,
  breakClassName?: string,
  extraAriaContext?: string
};

export default class PaginationBoxView extends Component<Props> {
  static defaultProps = {
    pageCount: 10,
    pageRangeDisplayed: 2,
    marginPagesDisplayed: 3,
    activeClassName: 'selected',
    previousClassName: 'previous',
    nextClassName: 'next',
    previousLabel: 'Previous',
    nextLabel: 'Next',
    breakLabel: '...',
    disabledClassName: 'disabled',
    disableInitialCallback: false
  };

  constructor(props) {
    super(props);

    const forcePage = props.forcePage ? props.forcePage : 0;
    const selectedPage = props.initialPage ? props.initialPage : forcePage;

    this.state = {
      selected: selectedPage
    };
  }

  componentDidMount() {
    const { initialPage, disableInitialCallback } = this.props;
    // Call the callback with the initialPage item:
    if (typeof initialPage !== 'undefined' && !disableInitialCallback) {
      this.callCallback(initialPage);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (
      typeof nextProps.forcePage !== 'undefined' &&
      this.props.forcePage !== nextProps.forcePage
    ) {
      this.setState({ selected: nextProps.forcePage });
    }
  }

  handlePreviousPage = evt => {
    const { selected } = this.state;
    evt.preventDefault ? evt.preventDefault() : (evt.returnValue = false);
    if (selected > 0) {
      this.handlePageSelected(selected - 1, evt);
    }
  };

  handleNextPage = evt => {
    const { selected } = this.state;
    const { pageCount } = this.props;

    evt.preventDefault ? evt.preventDefault() : (evt.returnValue = false);
    if (selected < pageCount - 1) {
      this.handlePageSelected(selected + 1, evt);
    }
  };

  handlePageSelected = (selected, evt) => {
    evt.preventDefault ? evt.preventDefault() : (evt.returnValue = false);

    if (this.state.selected === selected) return;

    this.setState({ selected });

    // Call the callback with the new selected item:
    this.callCallback(selected);
  };

  hrefBuilder(pageIndex) {
    const { hrefBuilder, pageCount } = this.props;
    if (
      hrefBuilder &&
      pageIndex !== this.state.selected &&
      pageIndex >= 0 &&
      pageIndex < pageCount
    ) {
      return hrefBuilder(pageIndex + 1);
    }
  }

  callCallback = selectedItem => {
    if (
      typeof this.props.onPageChange !== 'undefined' &&
      typeof this.props.onPageChange === 'function'
    ) {
      this.props.onPageChange({ selected: selectedItem });
    }
  };

  getPageElement(index) {
    const { selected } = this.state;
    const { pageClassName, pageLinkClassName, activeClassName, extraAriaContext } = this.props;

    return (
      <PageView
        key={index}
        onClick={this.handlePageSelected.bind(null, index)}
        selected={selected === index}
        pageClassName={pageClassName}
        pageLinkClassName={pageLinkClassName}
        activeClassName={activeClassName}
        extraAriaContext={extraAriaContext}
        href={this.hrefBuilder(index)}
        page={index + 1}
      />
    );
  }

  pagination = () => {
    const items = [];
    const {
      pageRangeDisplayed,
      pageCount,
      marginPagesDisplayed,
      breakLabel,
      breakClassName
    } = this.props;

    const { selected } = this.state;

    if (pageCount <= pageRangeDisplayed) {
      for (let index = 0; index < pageCount; index++) {
        items.push(this.getPageElement(index));
      }
    } else {
      let leftSide = pageRangeDisplayed / 2;
      let rightSide = pageRangeDisplayed - leftSide;

      if (selected > pageCount - pageRangeDisplayed / 2) {
        rightSide = pageCount - selected;
        leftSide = pageRangeDisplayed - rightSide;
      } else if (selected < pageRangeDisplayed / 2) {
        leftSide = selected;
        rightSide = pageRangeDisplayed - leftSide;
      }

      let index;
      let page;
      let breakView;
      const createPageView = current => this.getPageElement(current);

      for (index = 0; index < pageCount; index++) {
        page = index + 1;

        if (page <= marginPagesDisplayed) {
          items.push(createPageView(index));
          continue;
        }

        if (page > pageCount - marginPagesDisplayed) {
          items.push(createPageView(index));
          continue;
        }

        if (index >= selected - leftSide && index <= selected + rightSide) {
          items.push(createPageView(index));
          continue;
        }

        if (breakLabel && items[items.length - 1] !== breakView) {
          breakView = (
            <BreakView key={index} breakLabel={breakLabel} breakClassName={breakClassName} />
          );
          items.push(breakView);
        }
      }
    }

    return items;
  };

  render() {
    const {
      disabledClassName,
      previousClassName,
      nextClassName,
      pageCount,
      containerClassName,
      previousLinkClassName,
      previousLabel,
      nextLinkClassName,
      nextLabel
    } = this.props;

    const { selected } = this.state;

    const previousClasses = previousClassName + (selected === 0 ? ` ${disabledClassName}` : '');
    const nextClasses = nextClassName + (selected === pageCount - 1 ? ` ${disabledClassName}` : '');

    return (
      <ul className={containerClassName}>
        <li className={previousClasses}>
          <a
            onClick={this.handlePreviousPage}
            className={previousLinkClassName}
            href={this.hrefBuilder(selected - 1)}
            tabIndex="0"
            role="button"
            onKeyPress={this.handlePreviousPage}
          >
            {previousLabel}
          </a>
        </li>

        {this.pagination()}

        <li className={nextClasses}>
          <a
            onClick={this.handleNextPage}
            className={nextLinkClassName}
            href={this.hrefBuilder(selected + 1)}
            tabIndex="0"
            role="button"
            onKeyPress={this.handleNextPage}
          >
            {nextLabel}
          </a>
        </li>
      </ul>
    );
  }
}
