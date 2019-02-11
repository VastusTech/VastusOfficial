import React, { Component } from 'react';
import Amplify, { Auth, Analytics } from 'aws-amplify';
import { inspect } from 'util';
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
        reactSwipeEl: null
 	};

 	swipeRight(reactSwipeEl) {
 	    if(this.state.slideNum < 2) {
 	        this.setState({slideNum: this.state.slideNum + 1});
        }
        reactSwipeEl.next()
    }

    swipeLeft(reactSwipeEl) {
        if(this.state.slideNum > 0) {
            this.setState({slideNum: this.state.slideNum - 1});
        }
        reactSwipeEl.prev()
    }

    goToFirstPage(reactSwipeEl) {
 	    if(this.state.slideNum === 2) {
            this.swipeLeft(reactSwipeEl);
            this.swipeLeft(reactSwipeEl);
        }
        else if(this.state.slideNum === 1) {
            this.swipeLeft(reactSwipeEl);
        }
    }

    goToSecondPage(reactSwipeEl) {
        if(this.state.slideNum === 0) {
            this.swipeRight(reactSwipeEl);
        }
        else if(this.state.slideNum === 2) {
            this.swipeLeft(reactSwipeEl);
        }
    }

    goToThirdPage(reactSwipeEl) {
        if(this.state.slideNum === 0) {
            this.swipeRight(reactSwipeEl);
            this.swipeRight(reactSwipeEl);
        }
        else if(this.state.slideNum === 1) {
            this.swipeRight(reactSwipeEl);
        }
    }

    displayPage() {
 	    let reactSwipeEl = this.state.reactSwipeEl;
 	    if(this.state.slideNum === 0) {
 	        return (
                <Grid>
                    <Grid.Column>
                        <Icon name='circle' onClick={() => this.goToFirstPage(reactSwipeEl)}/>
                    </Grid.Column>
                    <Grid.Column>
                        <Icon name='circle outline' onClick={() => this.goToSecondPage(reactSwipeEl)}/>
                    </Grid.Column>
                    <Grid.Column>
                        <Icon name='circle outline' onClick={() => this.goToThirdPage(reactSwipeEl)}/>
                    </Grid.Column>
                </Grid>
                    );
        }
        else if(this.state.slideNum === 1) {
            return (
                <Grid>
                    <Grid.Column>
                        <Icon name='circle outline' onClick={() => this.goToFirstPage(reactSwipeEl)}/>
                    </Grid.Column>
                    <Grid.Column>
                        <Icon name='circle' onClick={() => this.goToSecondPage(reactSwipeEl)}/>
                    </Grid.Column>
                    <Grid.Column>
                        <Icon name='circle outline' onClick={() => this.goToThirdPage(reactSwipeEl)}/>
                    </Grid.Column>
                </Grid>
            );
        }
        else if(this.state.slideNum === 2) {
            return (
                <Grid>
                    <Grid.Column>
                        <Icon name='circle outline' onClick={() => this.goToFirstPage(reactSwipeEl)}/>
                    </Grid.Column>
                    <Grid.Column>
                        <Icon name='circle outline' onClick={() => this.goToSecondPage(reactSwipeEl)}/>
                    </Grid.Column>
                    <Grid.Column>
                        <Icon name='circle' onClick={() => this.goToThirdPage(reactSwipeEl)}/>
                    </Grid.Column>
                </Grid>
            );
        }
        else {
            return (
                <Grid>
                    <Grid.Column onClick={() => this.goToFirstPage(reactSwipeEl)}>
                        <Icon name='circle outline' onClick={() => this.goToFirstPage(reactSwipeEl)}/>
                    </Grid.Column>
                    <Grid.Column>
                        <Icon name='circle outline' onClick={() => this.goToSecondPage(reactSwipeEl)}/>
                    </Grid.Column>
                    <Grid.Column>
                        <Icon name='circle outline' onClick={() => this.goToThirdPage(reactSwipeEl)}/>
                    </Grid.Column>
                </Grid>
            );
        }
    }

 	toggleVisibility = () => this.setState({ visible: !this.state.visible });

    render() {
        let reactSwipeEl;
    	const { visible } = this.state;
		return(
  			<Transition visible={visible} animation='scale' duration={500}>
				<Container className='login-form'>
    	 			<Grid width='100%' textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
            			<Grid.Row style={{ maxWidth: 600, minWidth: 300}}>
									<ReactSwipe
										className="carousel"
										swipeOptions={{ continuous: false }}
										ref={el => (reactSwipeEl = el)}
									>
										<div>
                                        <Segment raised padded inverted>
                                            <Image src={Logo} size = 'tiny' centered/>
                                            <h2>VASTUS</h2>
                                            <h2>The 21st Century Standard of Fitness</h2>
                                            <Divider/>
                                            <h3>Vastus is the latest technology to upgrade your workout.</h3>
                                            <h3>Compete with friends</h3>
                                            <h3>Win prizes from fitness brands</h3>
                                            <h3>Learn from fitness pros</h3>
                                        </Segment>
										</div>
										<div>
                                        <Segment raised padded inverted>
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
										</div>
                                        <div>
                                            <SignInPage/>
                                        </div>
									</ReactSwipe>
						</Grid.Row>
                        <Grid.Row>
                            <Grid columns='equal'>
                                <Grid.Column onClick={() => this.swipeLeft(reactSwipeEl)}>
                                    <Icon size='large' name="chevron circle left"/>
                                </Grid.Column>
                                <Grid.Column>
                                    {this.displayPage()}
                                </Grid.Column>
                                <Grid.Column onClick={() => this.swipeRight(reactSwipeEl)}>
                                    <Icon size='large' name="chevron circle right"/>
                                </Grid.Column>
                            </Grid>
                        </Grid.Row>
					</Grid>
				</Container>
			</Transition>
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