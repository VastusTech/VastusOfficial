import React, { Component } from 'react';
import Amplify, { Auth, Analytics } from 'aws-amplify';
import { inspect } from 'util';
import _ from 'lodash';
import Semantic, {
    Image,
    Container,
    Reveal,
    Rail,
    Segment,
    Grid,
    Divider,
    Sticky,
    Button,
    Icon
} from 'semantic-ui-react';
import { connect } from "react-redux";
import {logOut} from "../redux_helpers/actions/authActions";
import SignInPage from './SignInPage';
import ForgotPasswordModal from "./ForgotPasswordModal";
import Logo from '../vastuscomponents/img/the_logo.svg';
import ReactSwipe from "react-swipe";
import Breakpoint from "react-socks";

const transition = 'browse';

class OpeningScreen extends Component {

 	state = {
 	    visible: true,
        slideNum: 0,
        reactSwipeEl: null,
        circles: ['circle', 'circle outline', 'circle outline'],
        active: true
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
            <Grid.Column width={1}>
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

    handleContextRef = contextRef => this.setState({ contextRef });

    handleToggle = () => this.setState({ active: !this.state.active });

    render() {
        const { active, contextRef } = this.state;
        let reactSwipeEl;
        let self = this;
    	const { visible } = this.state;
		return (
		    <div>
		    <Breakpoint small down>
		    <Grid verticalAlign='middle' centered>
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
                            <Grid textAlign='center' centered style={{marginLeft: '30px', marginRight: '30px', marginTop: '5px', height: 610}}>
                                <Segment raised padded inverted style={{ maxWidth: 600 }}>
                                    <Grid centered>
                                        <Segment inverted style={{ maxWidth: 600, marginTop: '10px'}}>
                                            <Image src={Logo} size = 'tiny' centered/>
                                            <h2>VASTUS</h2>
                                            <h2>The 21st Century Standard of Fitness</h2>
                                            <Divider style={{marginBottom: '30px'}}/>
                                            <h3>Vastus Brings You a Cutting Edge Fitness Experience.</h3>
                                            <h3>Compete with Friends</h3>
                                            <h3>Train with Pros</h3>
                                            <h3>Find your Path to Personal Greatness</h3>
                                        </Segment>
                                    </Grid>
                                </Segment>
                            </Grid>
                        </div>
                        <div>
                            <Grid textAlign='center' centered style={{marginLeft: '30px', marginRight: '30px', marginTop: '5px', height: 610}}>
                                <Segment inverted style={{ maxWidth: 500}}>
                                    <Grid centered textAlign='center' style={{ maxWidth: 500 }}>
                                        <Segment inverted style={{ maxWidth: 600, marginTop: '10px'}}>
                                            <Image src={Logo} size = 'tiny' centered/>
                                            <h2>VASTUS<br/>
                                                How does it work?</h2>
                                            <Divider style={{marginBottom: '-20px', marginTop: '-10px'}}/>
                                            <h3>1. Pros, Forums, Challenges... <br/><br/>
                                                2. Pros and Forums provide advice and training.<br/><br/>
                                                3. Join a challenge for enhanced motivation. Winners get free training.<br/><br/>
                                                4. Achieve your fittest self.
                                            </h3>
                                            <Button content={visible ? 'Get Vastus Fit' : 'Get Vastus Fit'} onClick={() => this.swipeRight(reactSwipeEl)} color = 'purple' size = 'massive'/>
                                        </Segment>
                                    </Grid>
                                </Segment>
                            </Grid>
                        </div>
                        <div>
                            <Grid textAlign='center' centered style={{marginLeft: '30px', marginRight: '30px', marginTop: '5px', height: 610}}>
                                <Segment inverted style={{ maxWidth: 430}}>
                                    <SignInPage/>
                                </Segment>
                            </Grid>
                        </div>
                    </ReactSwipe>
                </Grid.Row>
                <Grid.Row columns={5} style={{marginLeft: '76px', marginRight: '76px', marginTop: '-20px'}}>
                    <Grid.Column floated='left'>
                        <Icon size='large' name="chevron circle left" onClick={() => this.swipeLeft(reactSwipeEl)}/>
                    </Grid.Column>
                    {/*this.displayPage()*/}
                    <Grid.Column floated='right'>
                        <Icon size='large' name="chevron circle right" onClick={() => this.swipeRight(reactSwipeEl)}/>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
            </Breakpoint>



            <Breakpoint medium up>
                <Grid centered columns={1}>
                    <Grid.Column>
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
                                        <Grid textAlign='center' centered style={{marginLeft: '30px', marginRight: '30px', marginTop: '5px'}}>
                                            <Segment raised padded inverted>
                                                <Grid centered>
                                                    <Segment inverted style={{marginTop: '10px', maxWidth: 430, minHeight: 630}}>
                                                        <Image src={Logo} size = 'tiny' centered/>
                                                        <h2>VASTUS</h2>
                                                        <h2>The 21st Century Standard of Fitness</h2>
                                                        <Divider style={{marginBottom: '30px'}}/>
                                                        <h3>Vastus Brings You a Cutting Edge Fitness Experience.</h3>
                                                        <h3>Compete with Friends</h3>
                                                        <h3>Train with Pros</h3>
                                                        <h3>Find your Path to Personal Greatness</h3>
                                                    </Segment>
                                                </Grid>
                                            </Segment>
                                        </Grid>
                                    </div>
                                    <div>
                                        <Grid textAlign='center' centered style={{marginLeft: '30px', marginRight: '30px', marginTop: '30px'}}>
                                            <Segment inverted>
                                                <Grid centered textAlign='center'>
                                                    <Segment inverted style={{marginTop: '10px', maxWidth: 430, minHeight: 630}}>
                                                        <Image src={Logo} size = 'tiny' centered/>
                                                        <h2>VASTUS<br/>
                                                            How does it work?</h2>
                                                        <Divider style={{marginBottom: '30px'}}/>
                                                        <h3>1. Pros, Forums, Challenges... <br/><br/>
                                                            2. Pros and Forums provide advice and training.<br/><br/>
                                                            3. Join a challenge for enhanced motivation. <br/>Winners get free training.<br/><br/>
                                                            4. Achieve your fittest self.
                                                        </h3>
                                                        <Button content={visible ? 'Get Vastus Fit' : 'Get Vastus Fit'} onClick={() => this.swipeRight(reactSwipeEl)} color = 'purple' size = 'massive'/>
                                                    </Segment>
                                                </Grid>
                                            </Segment>
                                        </Grid>
                                    </div>
                                    <div>
                                        <Grid textAlign='center' centered style={{marginLeft: '30px', marginRight: '30px', marginTop: '5px', marginBottom: '50px'}}>
                                            <Segment inverted style={{ marginTop: '10px', maxWidth: 430, minHeight: 660}}>
                                                <SignInPage/>
                                            </Segment>
                                        </Grid>
                                    </div>
                                </ReactSwipe>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid centered columns={5} style={{marginLeft: '30px'}}>
                                <Grid.Column width={1}>
                                    <Icon size='large' name="chevron circle left" onClick={() => this.swipeLeft(reactSwipeEl)}/>
                                </Grid.Column>
                                {this.displayPage()}
                                <Grid.Column width={1}>
                                    <Icon size='large' name="chevron circle right" onClick={() => this.swipeRight(reactSwipeEl)}/>
                                </Grid.Column>
                            </Grid>
                        </Grid.Row>
                    </Grid.Column>
                    </Grid>
            </Breakpoint>
        </div>
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