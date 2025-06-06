---
uid: appointmentagent-acceptwithsmtpemailconfirmation
title: AppointmentAgent.AcceptWithSmtpEmailConfirmation event method
description: Scripting events called on the AcceptWithSmtpEmailConfirmation method on the AppointmentAgent service agent.
so.generated: true
keywords: netserver scripting
so.topic: reference
so.envir: onsite
---
# AppointmentAgent.AcceptWithSmtpEmailConfirmation

Scripting events called on the <see cref='M:IAppointmentAgent.AcceptWithSmtpEmailConfirmation'>AcceptWithSmtpEmailConfirmation</see> method on the <see cref='IAppointmentAgent'>IAppointmentAgent</see>  service agent.

## BeforeAcceptWithSmtpEmailConfirmation
```cs
    static void BeforeAcceptWithSmtpEmailConfirmation(
       Int32  appointmentId,
       RecurrenceUpdateMode  updateMode,
       EMailConnectionInfo  smtpEMailConnectionInfo,
       ref object  eventState
      );
```
Executes before the service method is invoked.
It can store some state in the *eventState* parameter, that is passed to the **After** and **AfterAsync** methods in this service call.
Event state is not preserved between different service calls. It is set to null at the start of each service call.
## AfterAcceptWithSmtpEmailConfirmation
```cs
    static void AfterAcceptWithSmtpEmailConfirmation(
       Int32  appointmentId,
       RecurrenceUpdateMode  updateMode,
       EMailConnectionInfo  smtpEMailConnectionInfo,
       ref object  eventState
      );
```
Executes after the service method has been invoked. The service waits for this method to complete before returning the result to the caller.
This service call has no return value, so there is no **returnValue** parameter
Any state you set in the **Before** method is passed in through the *eventState* parameter.
## AfterAcceptWithSmtpEmailConfirmationAsync
```cs
    static void AfterAcceptWithSmtpEmailConfirmationAsync(
       Int32  appointmentId,
       RecurrenceUpdateMode  updateMode,
       EMailConnectionInfo  smtpEMailConnectionInfo,
       ref object  eventState
      );
```
Executes after the service method is invoked, without waiting for the call to return.
The service call is not blocked waiting for this method to complete.
Any state you set in the **Before** method is passed in through the *eventState* parameter.

