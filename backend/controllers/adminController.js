const { connection } = require('../config/db')

// ─── DB Helper ────────────────────────────────────────────────────────────────
// Fix: Use promises instead of raw callbacks for consistency with cartController.js
// TODO: Move this to utils/db.js and import it everywhere
const runQuery = (sql, values = []) =>
  new Promise((resolve, reject) =>
    connection.query(sql, values, (err, results) => (err ? reject(err) : resolve(results)))
  )


// ─── Role Setter Factory ──────────────────────────────────────────────────────
// Fix: Both controllers were near-identical — replaced with a single factory
//      to eliminate duplication and make adding new roles trivial.
const makeRoleController = (role) => async (req, res) => {
  const id = parseInt(req.params.id)

  if (isNaN(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid id'
    })
  }

  try {
    const result = await runQuery(
      'UPDATE users SET role = ? WHERE id = ?',
      [role, id]
    )

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }

    return res.status(200).json({
      success: true,
      message: `User #${id} has been assigned the role of '${role}'`
    })

  } catch (err) {
    // Fix: Log the actual DB error so it's visible during debugging
    console.error(`[makeRoleController:${role}]`, err)
    return res.status(500).json({
      success: false,
      message: 'Failed to update user role'
    })
  }
}


const adminMakerController = makeRoleController('admin')
const ownerMakerController = makeRoleController('owner')

module.exports = { adminMakerController, ownerMakerController }
