import "./HowItWorks.css";

export default function HowItWorks() {
  return (
    <div className="how-container">
      <h1 className="how-title">How to Use Evangadi Networks Q&amp;A</h1>

      <section className="how-box">
        <h2>User Registration</h2>
        <p>To join Evangadi Networks Q&amp;A, you need to create an account:</p>
        <ol>
          <li>
            Click the <strong>Sign In</strong> button in the top-right corner.
          </li>
          <li>
            Switch to <strong>Create a new account</strong>.
          </li>
          <li>
            Fill in:
            <ul>
              <li>Username</li>
              <li>First Name</li>
              <li>Last Name</li>
              <li>Email</li>
              <li>Password</li>
            </ul>
          </li>
          <li>
            Click <strong>Agree and Join</strong>.
          </li>
          <li>You’ll see a confirmation message.</li>
        </ol>
      </section>

      <section className="how-box">
        <h2>User Login</h2>
        <ol>
          <li>
            Click <strong>Sign In</strong>.
          </li>
          <li>Enter Email and Password.</li>
          <li>
            Click <strong>Login</strong>.
          </li>
        </ol>
      </section>

      <section className="how-box">
        <h2>Asking a Question</h2>
        <ol>
          <li>
            Click <strong>Ask Question</strong> on Home.
          </li>
          <li>Enter Title and Description.</li>
          <li>
            Click <strong>Post Your Question</strong>.
          </li>
        </ol>
      </section>

      <section className="how-box">
        <h2>Viewing Questions and Answers</h2>
        <ol>
          <li>Browse questions on the Home page.</li>
          <li>Click a question to view details.</li>
          <li>Answer if no responses exist.</li>
        </ol>
      </section>

      <section className="how-box">
        <h2>Submitting an Answer</h2>
        <ol>
          <li>Open a question.</li>
          <li>
            Scroll to <strong>Answer The Top Question</strong>.
          </li>
          <li>Write your answer.</li>
          <li>
            Click <strong>Post Your Answer</strong>.
          </li>
        </ol>
      </section>

      <section className="how-box">
        <h2>Logging Out</h2>
        <p>
          Click <strong>Logout</strong> in the header to end your session.
        </p>
      </section>

      <section className="how-box">
        <h2>Support and Feedback</h2>
        <ul>
          <li>
            Contact support via the <strong>About</strong> page.
          </li>
          <li>Submit feedback from your profile.</li>
        </ul>
      </section>
    </div>
  );
}
