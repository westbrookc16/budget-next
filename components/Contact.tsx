import styles from '@/css/contact.module.css';
import React from 'react';

const Contact = () => {
  return (
    <section id='contact'>
      {/* <div className={styles.container}> */}
      <div className={styles.contact__container}>
        <h2 className='font-semibold text-xl lg:text-2xl'>Contact Us</h2>
        <div className='italic text-sm text-center items-center md:text-lg'>
          Please feel free to leave feedback or ask questions. We will get back
          to you as soon as possible!
        </div>
        <div className={styles.formContainer}>
          <form
            className={styles.form}
            action='https://formspree.io' //form spree action url
            method='POST'
          >
            <label className={styles.label}>
              Name<span className={styles.span}>*</span>
            </label>
            <input className={styles.input} type='text' name='name' required />
            <label className={styles.label}>
              Email<span className={styles.span}>*</span>
            </label>
            <input
              className={styles.input}
              type='email'
              name='email'
              required
            />
            <label className={styles.label}>
              Message<span className={styles.span}>*</span>
            </label>
            <textarea
              className={styles.textarea}
              required
              name='message'
              rows={8}
            ></textarea>
            <button type='submit' className={styles.btn}>
              Submit
            </button>
          </form>
          {/* </div> */}
        </div>
      </div>
    </section>
  );
};

export default Contact;
