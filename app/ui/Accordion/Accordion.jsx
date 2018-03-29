// @flow
import React from 'react';

// material-ui components
import withStyles from 'material-ui/styles/withStyles';
import ExpansionPanel from 'material-ui/ExpansionPanel';
import ExpansionPanelSummary from 'material-ui/ExpansionPanel/ExpansionPanelSummary';
import ExpansionPanelDetails from 'material-ui/ExpansionPanel/ExpansionPanelDetails';

// material-ui-icons
import ExpandMore from 'material-ui-icons/ExpandMore';

import accordionStyle from '../../asets/jss/material-dashboard-pro-react/components/accordionStyle';

export type Props = {
  classes: Object,
  // index of the default active collapse
  active?: number,
  collapses: Array<{
    title?: string,
    content?: number | string | React.Element | Array<any>
  }>
};

class Accordion extends React.Component {
  props: Props;
  constructor(props: Props) {
    super(props);
    this.state = {
      active: props.active
    };
  }

  handleChange = panel => (event, expanded) => {
    this.setState({
      active: expanded ? panel : -1
    });
  };
  render() {
    const { classes, collapses } = this.props;
    return (
      <div className={classes.root}>
        {collapses.map((prop, key) => (
          <ExpansionPanel
            expanded={this.state.active === key}
            onChange={this.handleChange(key)}
            key={key}
            classes={{
                root: classes.expansionPanel,
                expanded: classes.expansionPanelExpanded
              }}
          >
            <ExpansionPanelSummary
              expandIcon={<ExpandMore />}
              classes={{
                  root: classes.expansionPanelSummary,
                  expanded: classes.expansionPanelSummaryExpaned,
                  content: classes.expansionPanelSummaryContent,
                  expandIcon: classes.expansionPanelSummaryExpandIcon,
                  expandIconExpanded:
                    classes.expansionPanelSummaryExpandIconExpanded
                }}
            >
              <h4 className={classes.title}>{prop.title}</h4>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails className={classes.expansionPanelDetails}>
              {prop.content}
            </ExpansionPanelDetails>
          </ExpansionPanel>
          ))}
      </div>
    );
  }
}

Accordion.defaultProps = {
  active: -1
};

export default withStyles(accordionStyle)(Accordion);
