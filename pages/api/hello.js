// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
/**
 * REQUIRED API Functionality
 * 
 * Generate New Code
 * - Requires a key to work
 * - runs generation code
 * - uploads new code to supabase along w creation metadata
 * 
 * 
 * Check Valid Code
 * - requires a private api key to work
 * - then queries generated code with db and returns
 * - TRUE, if the code exists and has not been used
 * - FALSE otherwise
 * 
 * Get Prices
 * - query database from tier and price items
 * 
 * 
 * HOOK
 * - valid purchase
 * - after purchase has been confirmed - set the code to used in the db
 * - generate a qr code with a a link like domain.com/ticket/ticketid
 * 
 * 
 * Website functionality
 * - base page
 *    - see event info
 *    - enter ticket code and submit
 *    - see current tier and pricing info
 *    - get the user to enter their name and email + email confirmation
 *    - redirect to stripe for payment
 * 
 * - generate code
 *    - maybe password???
 *    - enter name
 *    - get code
 * 
 * - payment success poge
 *    - basic event info
 *    - make it clear that the persons ticket has been purchased and that they will get an email with the ticket shortly
 *    - allow them to go back to event page
 * 
 * 
 * - /ticket/ticketid
 *   displays ticket information
 *   and a button that says "Check In"
 * KappaSigma?UBC
 *  */ 


export default function handler(req, res) {
  res.status(200).json({ name: 'John Doe' })
}
