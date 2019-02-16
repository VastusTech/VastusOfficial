import React, { Component } from 'react';
import Amplify, { Auth, Analytics } from 'aws-amplify';
import { inspect } from 'util';
import _ from 'lodash';
import Semantic, {
    Image,
    Container,
    Reveal,
    Label,
    Segment,
    Grid,
    Divider,
    Transition,
    Button,
    Icon
} from 'semantic-ui-react';
import { connect } from "react-redux";
import {logOut} from "../redux_helpers/actions/authActions";
import SignInPage from './SignInPage';
import ForgotPasswordModal from "./ForgotPasswordModal";
import Logo from '../vastuscomponents/img/the_logo.svg';
import ReactSwipe from "react-swipe";

const transition = 'browse';

class OpeningScreen extends Component {

 	state = {
 	    visible: true,
        slideNum: 0,
        reactSwipeEl: null,
        circles: ['circle', 'circle outline', 'circle outline']
 	};

 	swipeRight = (reactSwipeEl) => {
 	    if(this.state.slideNum === 0) {
 	        this.setState({slideNum: this.state.slideNum + 1});
            this.setState({circles: ['circle outline', 'circle', 'circle outline']});
        }
        if(this.state.slideNum === 1) {
            this.setState({slideNum: this.state.slideNum + 1});
            this.setState({circles: ['circle outline', 'circle outline', 'circle']});
        }
        reactSwipeEl.next();
    }

    swipeLeft = (reactSwipeEl) => {
        if(this.state.slideNum === 2) {
            this.setState({slideNum: this.state.slideNum - 1});
            this.setState({circles: ['circle outline', 'circle', 'circle outline']});
        }
        if(this.state.slideNum === 1) {
            this.setState({slideNum: this.state.slideNum - 1});
            this.setState({circles: ['circle', 'circle outline', 'circle outline']});
        }
        reactSwipeEl.prev();
    }

    displayPage = () => {
        return _.times(3, i => (
            <Grid.Column>
                <Icon name={this.state.circles[i]}/>
            </Grid.Column>
        ));
    }

    adjustCircles(index) {
 	    if(0 <= index <= 2) {
            this.setState({slideNum: index});
        }

        if(index === 0) {
            this.setState({circles: ['circle', 'circle outline', 'circle outline']});
        }
        else if(index === 1) {
            this.setState({circles: ['circle outline', 'circle', 'circle outline']});
        }
        else if(index === 2) {
            this.setState({circles: ['circle outline', 'circle outline', 'circle']});
        }
        alert(index);
    }

 	toggleVisibility = () => this.setState({ visible: !this.state.visible });

    render() {

        let reactSwipeEl;
        let self = this;
    	const { visible } = this.state;
		return(<Grid verticalAlign='middle' centered>
                <Grid.Row>
                            <ReactSwipe
                                className="carousel"
                                swipeOptions={{
                                    stopPropagation: true,
                                    continuous: false,
                                    /*callback: function(index, elem) {
                                        //self.adjustCircles(index);
                                        //alert(index);
                                    },*/
                                }}
                                ref={el => (reactSwipeEl = el)}
                            >
                                <div>
                                <Grid textAlign='center' centered>
                                    <Segment raised padded inverted style={{ maxWidth: 600 }}>
                                        <Grid centered>
                                            <Segment inverted style={{ maxWidth: 400, marginTop: '30px', marginBottom: '30px' }}>
                                            <Image src={Logo} size = 'tiny' centered/>
                                            <h2>VASTUS</h2>
                                            <h2>The 21st Century Standard of Fitness</h2>
                                            <Divider/>
                                            <h3>Vastus is the latest technology
                                            to upgrade your workout.</h3>
                                            <h3>Compete with friends</h3>
                                            <h3>Win prizes from fitness brands</h3>
                                            <h3>Learn from fitness pros</h3>
                                            </Segment>
                                        </Grid>
                                    </Segment>
                                </Grid>
                                </div>
                                <div>
                                <Grid textAlign='center' centered>
                                    <Segment raised padded inverted style={{ maxWidth: 600 }}>
                                        <Grid centered>
                                            <Segment inverted style={{ maxWidth: 400, marginTop: '30px', marginBottom: '30px' }}>
                                            <Image src={Logo} size = 'tiny' centered/>
                                            <h2>VASTUS</h2>
                                            <h2>How does it work?</h2>
                                            <Divider/>
                                            <h3>1. Sign in to a challenge
                                            </h3>
                                            <h3>2. Send in videos of yourself completing the challenge
                                            </h3>
                                            <h3>3. The best video submission wins! </h3>
                                            <Button content={visible ? 'Get Vastus Fit' : 'Get Vastus Fit'} onClick={() => this.swipeRight(reactSwipeEl)} color = 'purple' size = 'massive'/>
                                            </Segment>
                                        </Grid>
                                    </Segment>
                                </Grid>
                                </div>
                                <div>
                                    <SignInPage/>
                                </div>
                            </ReactSwipe>
                </Grid.Row>
                <Grid.Row>
                        <Grid.Column>
                            <Icon size='large' name="chevron circle left" onClick={() => this.swipeLeft(reactSwipeEl)}/>
                        </Grid.Column>
                        {/*this.displayPage()*/}
                        <Grid.Column>
                            <Icon size='large' name="chevron circle right" onClick={() => this.swipeRight(reactSwipeEl)}/>
                        </Grid.Column>
                </Grid.Row>
            </Grid>
		);
	}
}

const mapStateToProps = (state) => ({
    user: state.user
});

const mapDispatchToProps = (dispatch) => {
    return {
        logOut: () => {
            dispatch(logOut());
        }
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(OpeningScreen);