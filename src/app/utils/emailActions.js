// src/utils/emailActions.js

export async function archiveEmail(gmail, messageId) {
    try {
      await gmail.users.messages.modify({
        userId: 'me',
        id: messageId,
        resource: { removeLabelIds: ['INBOX'] },
      });
      console.log(`Archived email with ID: ${messageId}`);
    } catch (error) {
      console.error('Error archiving email:', error);
      throw error;
    }
  }
  
  export async function deleteEmail(gmail, messageId) {
    try {
      await gmail.users.messages.delete({
        userId: 'me',
        id: messageId,
      });
      console.log(`Deleted email with ID: ${messageId}`);
    } catch (error) {
      console.error('Error deleting email:', error);
      throw error;
    }
  }
  