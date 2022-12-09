import type { NextApiRequest, NextApiResponse } from 'next'
import { ConnectToDB } from '../../backend/db/Database';
import { UserModel } from "../../backend/db/schemas/User";
import mongoose from 'mongoose';
let md5 = require("blueimp-md5");

type Data = {
  created: any
}

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
	if (req.method === 'POST') {
		res.status(200);
		// console.log(req.body.params.email);

		ConnectToDB();

		UserModel.findOne({
			email: req.body.params.email
		}, function (err, specified_user) {
			if (err) {
				console.log("error signing up");
			} else {
				if (specified_user?.email === undefined) {
					// console.log('an account can be created');
					let new_user = new UserModel({
						email: req.body.params.email,
						password: md5(req.body.params.pass)
					});
					new_user.save();
					res.json({
						created: 1
					})
				} else {
					console.log('this email already exists');
					// should respond to the user to notify them that an email already exists for this account
					res.json({
						created: 0
					});
				}
			}
		});
	}
}