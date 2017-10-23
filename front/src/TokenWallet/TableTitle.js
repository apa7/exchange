import { withStyles } from 'material-ui/styles';
import React from 'react'
import Typography from 'material-ui/Typography';

const styles = theme => ({
});

class TableTitle extends React.Component {
    render() {
        return (
            <Typography type='headline' color='inherit'>
                {this.props.title}
            </Typography>
        );
    }
}

export default withStyles(styles)(TableTitle)
