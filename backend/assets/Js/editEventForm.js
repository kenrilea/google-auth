let editEventForm = `<!--container for new event inputs-->
<div
  id="new_event_form_container"
  style="display: none;"
  class="outer_container"
>
  <!--Title input-->
  <input
    class="inner_container"
    type="text"
    id="newEventTitle"
    name="Title"
    placeholder="Title"
  />

  <!--description input-->
  <textarea
    rows="20"
    cols="20"
    id="newEventDescription"
    class="inner_container  input_description"
    placeholder="Description"
  ></textarea>

  <!--from input-->
  <input
    class="inner_container"
    type="text"
    id="newEventStart"
    name="From"
    placeholder="From: YYYY-MM-DDT00:00:00"
  />

  <!--to input-->
  <input
    class="inner_container"
    type="text"
    id="newEventEnd"
    name="To"
    placeholder="To: YYYY-MM-DDT00:00:00"
  />
  <!--button to save the event to google calendar-->
  <button onClick="handleAddEventClick()" class="button">Save</button>
</div>
<!--end of container for new event inputs-->`;
