<?php namespace mamouCRM\Http\Controllers;

use mamouCRM\User;
use Input;
use mamouCRM\Repositories\Interfaces\IMemberRepository;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use mamouCRM\Models\Permission as Permission;
use Config;
use Session;
use Validator;

class UserController extends Controller {
	public $userId = 3;

	public function __construct(IMemberRepository $memberRepo)
	{
		$this->memberRepo = $memberRepo;
	}


	/* function to list all members -- for the logged in */
	public function listAll()
	{
		$users = $this->memberRepo->getMembers($this->userId);
		return view('users.list')->with('users', $users)
								->with('js',['js/members/member.js']);
	}

	/* function to toggle users */
	public function activate()
	{
		$user = User::find(Input::get('ref'));
		$user->active = Input::get('state') == 'true' ? 1 : 0;
		$user->save();
	}

	/* function to change member password */
	public function chgMemberPass()
	{
		/* permissions check here */

		$pass = Input::get('p');
		$passConf = Input::get('p1');
		$userId = Input::get('ref');

		$response = array();
		$userPassObj = ['pass' => $pass, 'passConf' => $passConf];

		$validation = $this->validatePassChange($userPassObj);

        if($validation['status'])
        {
            //initiate save action
            $userInfo = User::find($userId);
            $userInfo->password = bcrypt($pass);
            $userInfo->save();
            $response['status'] = 1;
        }
        else
        {
        	$response['status'] = 0;
        	$response['messages'] = $validation['messages']->all();            
        }

        return response()->json($response);
	}

	/* validation function */
	private function validatePassChange($data)
	{
		$messages = [
        'pass.required' => 'Password cannot be empty.',
        'passConf.same' => 'Passwords do not match.',
        'pass.min' => 'Password must have minimum 5 characters.'        
        ];

        $rules = [
            'pass' => 'required|min:5',
            'passConf' => 'same:pass'
        ];

        $validator = Validator::make($data, $rules, $messages);

        if ($validator->fails())
        {
            return   ['status' => false, 'messages' => $validator->messages()];
        }
        else {
            return ['status' => true];
        }

	}



	/* list permissions for user */
	function listPermissions($memberId)
	{
		//TODO
		//validate $userId against children members

		//set user in session to retrieve in save function
		Session::put('midway', ['memberId' => $memberId]);

		//get user details for display
		$memberDetails = User::find($memberId);

		$userPermissions = $this->memberRepo->getPermissions($memberId);
		return view('users.permissions')->with('userPermissions',$userPermissions)
										->with('userDetails', $memberDetails)
										->with('js',['js/members/permissions.js']);
	}

	/* function to set permissions */
	public function setPermission()
	{
		$memberSessionData = Session::get('midway');
		$memberId = $memberSessionData['memberId'];
		$cond = ['user_id' => $memberId , 'action_id' => Input::get('ref')];


		// get constants for permissions
		$permList = Config::get('constants.permissions.access_list');
		$defaultPerm = Config::get('constants.permissions.default');

		//get posted values
		$perm = Input::get('permission');
		$actionId = Input::get('ref');
		$permVal = Input::get('state') == 'true' ? 1 : 0 ;	

		//validate values
		$key = array_search($perm, $permList);

		if($key !== false) {
				try
				{
				    $model = Permission::where($cond)->firstOrFail();				    
				    
				    //update with value
				    $oldVal = $model->permission;
				    $oldVal[$key] = $permVal;					

				   //save model		    
				    $model->permission = $oldVal;
				    $model->save();
				}
				// catch(Exception $e) catch any exception
				catch(ModelNotFoundException $e)
				{
				    $permission = new Permission();
				    $permission->user_id = $memberId;
				    $permission->action_id = $actionId;

				    $defaultPerm = $defaultPerm;   ///get from constant
				    $defaultPerm[$key] = $permVal;

				    $permission->permission = $defaultPerm;
				    $permission->save();
				}
		}
		else {

			//validation error -- invalid blacklist entry
			// show error page
		}


		
	}
}