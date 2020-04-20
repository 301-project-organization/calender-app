function deleteDate(req,res) {
    let SQL = 'DELETE FROM holidays WHERE id=1';
    //let value = [req.params.show_id];//when dynamic
    let value = [req.params];
    client.query(SQL,value)
    .then(res.redirect('/'))
}