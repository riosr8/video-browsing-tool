import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Image, Container, Header, Button, Grid, Segment, Responsive } from 'semantic-ui-react';
import { NavLink } from 'react-router-dom';

export const Home = props => {
  const { isAuthenticated } = props;

  return (
    <React.Fragment>
      <Responsive>
        <Segment
          inverted
          textAlign="center"
          style={{ minHeight: 500, padding: '1em 0em', backgroundColor: '#e11b37' }}
          vertical
        >
          <Image
            style={{ margin: 'auto' }}
            src="https://spme.org/wp-content/uploads/sites/5/2016/02/university-of-houston.png"
            size="small"
          />
          <Header
            as="h1"
            inverted
            style={{ fontSize: '4em', textAlign: 'center', paddingTop: '0.6em' }}
          >
            Video Browsing Tool
          </Header>
          <Header
            as="h2"
            inverted
            style={{ fontSize: '1.5em', textAlign: 'center', paddingTop: '0.8em' }}
          >
            In partnership with the University of Houston
          </Header>
          {!isAuthenticated ? (
            <Grid>
              <Grid.Row>
                <Grid.Column textAlign="center">
                  <NavLink to="/signup">
                    <Button content="Get Started" basic inverted size="huge" />
                  </NavLink>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          ) : null}
        </Segment>
        <Container
          style={{
            marginTop: '0.44em',
            backgroundColor: 'white',
            height: '100%',
            postion: 'fixed',
          }}
        >
          <div style={{ paddingTop: '3em' }}>
            <Header as="h3" content="Purpose" style={{ fontSize: '3em' }} />

            <p
              style={{
                color: 'black',
                fontSize: '1.33em',
                paddingLeft: '1em',
                paddingRight: '1em',
              }}
            >
              Video camera surveillance systems are common mode of monitoring human behavior in both
              public and private infrastructures. The need for enhanced security and the decline in
              cost of modern camera systems has led to the deployment of huge surveillance systems
              with thousands of cameras. These cameras produce and store large quantities of video
              data, which require analysis. Computer vision algorithms like object detection, face
              recognition can provide rich semantic information regarding the contents of the video.
              However, this would require us to gather video file and pass it to numerous computer
              vision algorithms, and manually read the output from the algorithm to interpret the
              results. The objective of the video browsing tool is to create a seamless pipeline,
              that can allow the users to upload and browse the video; and automatically process
              them using computer vision algorithms and display results.
            </p>
          </div>
          <div style={{ paddingTop: '3em' }}>
            <Header as="h1" content="About us" style={{ fontSize: '3em' }} />
            <p
              style={{
                color: 'black',
                fontSize: '1.33em',
                paddingLeft: '1em',
                paddingRight: '1em',
              }}
            >
              Behaviorics is a computer vision start-up with focus on building model for analyzing
              and predicting human behavior for the purpose of enhancing security and quality of
              human living. The current focus of Behaviorics is to enable processing of live video
              capture by surveillance cameras.
            </p>
          </div>
        </Container>
      </Responsive>
    </React.Fragment>
  );
};

/* istanbul ignore next */
const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.token !== null,
  };
};

export default connect(mapStateToProps)(Home);

Home.propTypes = {
  isAuthenticated: PropTypes.bool.isRequired,
};
